import { apiClient } from './client';
import type {
    Post,
    CreatePostDto,
    UpdatePostDto,
    GetPostsParams,
    PaginatedPostsResponse,
    ToggleLikeResponse,
    LikesCountResponse,
    IsLikedResponse,
    Comment,
    CreateCommentDto,
    UpdateCommentDto,
    PaginatedCommentsResponse,
    CommentsCountResponse,
    GetCommentsParams,
} from '../types/posts.types';

// ========== Posts API ==========

/**
 * Fetch paginated list of posts
 */
export const getPosts = async (
    params: GetPostsParams = {}
): Promise<PaginatedPostsResponse> => {
    const response = await apiClient.get<PaginatedPostsResponse>('/posts', {
        params,
    });
    return response.data;
};

/**
 * Fetch a single post by ID
 */
export const getPost = async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
};

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
};

/**
 * Update an existing post
 */
export const updatePost = async (
    postId: string,
    data: UpdatePostDto
): Promise<Post> => {
    const response = await apiClient.patch<Post>(`/posts/${postId}`, data);
    return response.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
};

// ========== Likes API ==========

/**
 * Toggle like on a post (like if not liked, unlike if already liked)
 */
export const toggleLike = async (
    postId: string
): Promise<ToggleLikeResponse> => {
    const response = await apiClient.post<ToggleLikeResponse>(
        `/posts/${postId}/like`
    );
    return response.data;
};

/**
 * Get total likes count for a post
 */
export const getLikesCount = async (
    postId: string
): Promise<LikesCountResponse> => {
    const response = await apiClient.get<LikesCountResponse>(
        `/posts/${postId}/likes/count`
    );
    return response.data;
};

/**
 * Check if current user has liked a post
 */
export const checkIfLiked = async (postId: string): Promise<IsLikedResponse> => {
    const response = await apiClient.get<IsLikedResponse>(
        `/posts/${postId}/likes/me`
    );
    return response.data;
};

// ========== Comments API ==========

/**
 * Fetch paginated comments for a post
 */
export const getComments = async (
    params: GetCommentsParams
): Promise<PaginatedCommentsResponse> => {
    const { postId, ...queryParams } = params;
    const response = await apiClient.get<PaginatedCommentsResponse>(
        `/posts/${postId}/comments`,
        { params: queryParams }
    );
    return response.data;
};

/**
 * Create a new comment on a post
 */
export const createComment = async (
    postId: string,
    data: CreateCommentDto
): Promise<Comment> => {
    const response = await apiClient.post<Comment>(
        `/posts/${postId}/comments`,
        data
    );
    return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (
    commentId: string,
    data: UpdateCommentDto
): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(
        `/posts/comments/${commentId}`,
        data
    );
    return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<void> => {
    await apiClient.delete(`/posts/comments/${commentId}`);
};

/**
 * Get total comments count for a post
 */
export const getCommentsCount = async (
    postId: string
): Promise<CommentsCountResponse> => {
    const response = await apiClient.get<CommentsCountResponse>(
        `/posts/${postId}/comments/count`
    );
    return response.data;
};
