import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { User } from '../types/auth.types';

// Initialize MMKV storage
const storage = new MMKV();

// Storage keys
const STORAGE_KEYS = {
    USER: 'auth.user',
    ACCESS_TOKEN: 'auth.accessToken',
    REFRESH_TOKEN: 'auth.refreshToken',
} as const;

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

// Helper functions for MMKV
const saveToStorage = (key: string, value: string) => {
    storage.set(key, value);
};

const getFromStorage = (key: string): string | undefined => {
    return storage.getString(key);
};

const removeFromStorage = (key: string) => {
    storage.delete(key);
};

export const useAuthStore = create<AuthStore>((set) => ({
    // Initial state
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    // Actions
    setUser: (user) =>
        set((state) => {
            if (user) {
                saveToStorage(STORAGE_KEYS.USER, JSON.stringify(user));
            } else {
                removeFromStorage(STORAGE_KEYS.USER);
            }
            return {
                user,
                isAuthenticated: !!user && !!state.accessToken,
            };
        }),

    setAccessToken: (token) =>
        set((state) => {
            saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, token);
            return {
                accessToken: token,
                isAuthenticated: !!state.user && !!token,
            };
        }),

    setRefreshToken: (token) =>
        set(() => {
            saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, token);
            return {
                refreshToken: token,
            };
        }),

    setAuth: (user, accessToken, refreshToken) =>
        set(() => {
            saveToStorage(STORAGE_KEYS.USER, JSON.stringify(user));
            saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (refreshToken) {
                saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            }
            return {
                user,
                accessToken,
                refreshToken: refreshToken || null,
                isAuthenticated: true,
            };
        }),

    logout: () =>
        set(() => {
            removeFromStorage(STORAGE_KEYS.USER);
            removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
            removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
            return {
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            };
        }),

    // Hydrate state from storage on app start
    hydrate: () => {
        const userStr = getFromStorage(STORAGE_KEYS.USER);
        const accessToken = getFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = getFromStorage(STORAGE_KEYS.REFRESH_TOKEN);

        if (userStr && accessToken) {
            try {
                const user = JSON.parse(userStr) as User;
                set({
                    user,
                    accessToken,
                    refreshToken: refreshToken || null,
                    isAuthenticated: true,
                });
            } catch (error) {
                console.error('Failed to parse user from storage:', error);
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            }
        }
    },
}));

// Selectors for optimized re-renders
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectAccessToken = (state: AuthStore) => state.accessToken;
