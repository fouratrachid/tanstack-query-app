import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';
import type {
    Post,
    CreatePostDto,
    UpdatePostDto,
    GetPostsParams,
    PaginatedPostsResponse,
    ToggleLikeResponse,
} from '../types/posts.types';
import * as postsApi from '../api/posts';

// ========== Query Keys ==========
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (params: GetPostsParams) => [...postKeys.lists(), params] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: string) => [...postKeys.details(), id] as const,
    likes: (id: string) => [...postKeys.detail(id), 'likes'] as const,
};

// ========== Posts Queries ==========

/**
 * Hook to fetch paginated posts with filters
 */
export const usePosts = (
    params: GetPostsParams = {},
    options?: Omit<
        UseQueryOptions<PaginatedPostsResponse, Error>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery<PaginatedPostsResponse, Error>({
        queryKey: postKeys.list(params),
        queryFn: () => postsApi.getPosts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

/**
 * Hook to fetch posts with infinite scroll
 */
export const useInfinitePosts = (
    params: Omit<GetPostsParams, 'page'> = {}
) => {
    return useInfiniteQuery<PaginatedPostsResponse, Error>({
        queryKey: [...postKeys.lists(), 'infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            postsApi.getPosts({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) =>
            lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook to fetch a single post by ID
 */
export const usePost = (
    postId: string,
    options?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<Post, Error>({
        queryKey: postKeys.detail(postId),
        queryFn: () => postsApi.getPost(postId),
        enabled: !!postId,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
};

// ========== Posts Mutations ==========

/**
 * Hook to create a new post
 */
export const useCreatePost = (
    options?: UseMutationOptions<Post, Error, CreatePostDto>
) => {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, CreatePostDto>({
        mutationFn: postsApi.createPost,
        onSuccess: (newPost) => {
            // Invalidate all posts lists to refetch with new post
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });

            // Optionally set the new post in cache
            queryClient.setQueryData(postKeys.detail(newPost.id), newPost);
        },
        ...options,
    });
};

/**
 * Hook to update an existing post
 */
export const useUpdatePost = (
    options?: UseMutationOptions<
        Post,
        Error,
        { postId: string; data: UpdatePostDto }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, { postId: string; data: UpdatePostDto }>({
        mutationFn: ({ postId, data }) => postsApi.updatePost(postId, data),
        onSuccess: (updatedPost, variables) => {
            // Update the post in cache
            queryClient.setQueryData(
                postKeys.detail(variables.postId),
                updatedPost
            );

            // Invalidate lists to refetch
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = (
    options?: UseMutationOptions<void, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: postsApi.deletePost,
        onSuccess: (_, postId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: postKeys.detail(postId) });

            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
        ...options,
    });
};

// ========== Likes Mutations ==========

/**
 * Hook to toggle like on a post
 */
export const useToggleLike = (
    options?: UseMutationOptions<ToggleLikeResponse, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation<ToggleLikeResponse, Error, string>({
        mutationFn: postsApi.toggleLike,
        onMutate: async (postId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

            // Snapshot previous value
            const previousPost = queryClient.getQueryData<Post>(
                postKeys.detail(postId)
            );

            // Optimistically update
            if (previousPost) {
                queryClient.setQueryData<Post>(postKeys.detail(postId), {
                    ...previousPost,
                    isLikedByCurrentUser: !previousPost.isLikedByCurrentUser,
                    likesCount: previousPost.isLikedByCurrentUser
                        ? previousPost.likesCount - 1
                        : previousPost.likesCount + 1,
                });
            }

            return { previousPost };
        },
        onError: (err, postId, context) => {
            // Rollback on error
            if (context?.previousPost) {
                queryClient.setQueryData(
                    postKeys.detail(postId),
                    context.previousPost
                );
            }
        },
        onSettled: (data, error, postId) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
        ...options,
    });
};
