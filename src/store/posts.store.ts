import { create } from 'zustand';
import { PostSortBy, SortOrder } from '../types/posts.types';

interface PostsState {
    // UI State
    sortBy: PostSortBy;
    sortOrder: SortOrder;
    filterUserId: string | null;

    // Actions
    setSortBy: (sortBy: PostSortBy) => void;
    setSortOrder: (order: SortOrder) => void;
    setFilterUserId: (userId: string | null) => void;
    toggleSortOrder: () => void;
    resetFilters: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    // Initial state
    sortBy: PostSortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
    filterUserId: null,

    // Actions
    setSortBy: (sortBy) => set({ sortBy }),

    setSortOrder: (sortOrder) => set({ sortOrder }),

    setFilterUserId: (filterUserId) => set({ filterUserId }),

    toggleSortOrder: () =>
        set((state) => ({
            sortOrder: state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
        })),

    resetFilters: () =>
        set({
            sortBy: PostSortBy.CREATED_AT,
            sortOrder: SortOrder.DESC,
            filterUserId: null,
        }),
}));
