import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';
import type {
    Comment,
    CreateCommentDto,
    UpdateCommentDto,
    PaginatedCommentsResponse,
    GetCommentsParams,
} from '../types/posts.types';
import * as postsApi from '../api/posts';
import { postKeys } from './usePosts';

// ========== Query Keys ==========
export const commentKeys = {
    all: ['comments'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (postId: string, params?: GetCommentsParams) =>
        [...commentKeys.lists(), postId, params] as const,
    detail: (id: string) => [...commentKeys.all, 'detail', id] as const,
};

// ========== Comments Queries ==========

/**
 * Hook to fetch paginated comments for a post
 */
export const useComments = (
    params: GetCommentsParams,
    options?: Omit<
        UseQueryOptions<PaginatedCommentsResponse, Error>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery<PaginatedCommentsResponse, Error>({
        queryKey: commentKeys.list(params.postId, params),
        queryFn: () => postsApi.getComments(params),
        enabled: !!params.postId,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
};

/**
 * Hook to fetch comments with infinite scroll
 */
export const useInfiniteComments = (
    postId: string,
    limit: number = 20
) => {
    return useInfiniteQuery<PaginatedCommentsResponse, Error>({
        queryKey: [...commentKeys.lists(), postId, 'infinite'],
        queryFn: ({ pageParam = 1 }) =>
            postsApi.getComments({ postId, page: pageParam as number, limit }),
        getNextPageParam: (lastPage) =>
            lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
        initialPageParam: 1,
        enabled: !!postId,
        staleTime: 1000 * 60 * 2,
    });
};

// ========== Comments Mutations ==========

/**
 * Hook to create a new comment
 */
export const useCreateComment = (
    options?: UseMutationOptions<
        Comment,
        Error,
        { postId: string; data: CreateCommentDto }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation<Comment, Error, { postId: string; data: CreateCommentDto }>({
        mutationFn: ({ postId, data }) => postsApi.createComment(postId, data),
        onSuccess: (newComment, variables) => {
            // Invalidate comments list for this post
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists(),
            });

            // Invalidate the post to update commentsCount
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });

            // Invalidate posts lists to reflect updated counts
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
        ...options,
    });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = (
    options?: UseMutationOptions<
        Comment,
        Error,
        { commentId: string; data: UpdateCommentDto }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation<Comment, Error, { commentId: string; data: UpdateCommentDto }>({
        mutationFn: ({ commentId, data }) =>
            postsApi.updateComment(commentId, data),
        onSuccess: (updatedComment) => {
            // Update the comment in cache
            queryClient.setQueryData(
                commentKeys.detail(updatedComment.id),
                updatedComment
            );

            // Invalidate comments lists
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists(),
            });
        },
        ...options,
    });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = (
    options?: UseMutationOptions<void, Error, { commentId: string; postId: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { commentId: string; postId: string }>({
        mutationFn: ({ commentId }) => postsApi.deleteComment(commentId),
        onSuccess: (_, variables) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: commentKeys.detail(variables.commentId),
            });

            // Invalidate comments lists
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists(),
            });

            // Invalidate the post to update commentsCount
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });

            // Invalidate posts lists
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
        ...options,
    });
};
