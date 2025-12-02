import { User } from './auth.types';

// ========== Post Types ==========

export interface Author {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    isPublished: boolean;
    author: Author;
    commentsCount: number;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostDto {
    title: string;
    content: string;
    imageUrl?: string;
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
    imageUrl?: string;
}

export enum PostSortBy {
    CREATED_AT = 'createdAt',
    LIKES = 'likes',
    COMMENTS = 'comments',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface GetPostsParams {
    page?: number;
    limit?: number;
    sortBy?: PostSortBy;
    order?: SortOrder;
    userId?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedPostsResponse {
    data: Post[];
    meta: PaginationMeta;
}

export interface ToggleLikeResponse {
    liked: boolean;
    likesCount: number;
}

export interface LikesCountResponse {
    count: number;
}

export interface IsLikedResponse {
    isLiked: boolean;
}

// ========== Comment Types ==========

export interface Comment {
    id: string;
    content: string;
    postId: string;
    author: Author;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentDto {
    content: string;
}

export interface UpdateCommentDto {
    content: string;
}

export interface PaginatedCommentsResponse {
    data: Comment[];
    meta: PaginationMeta;
}

export interface CommentsCountResponse {
    count: number;
}

export interface GetCommentsParams {
    postId: string;
    page?: number;
    limit?: number;
}
