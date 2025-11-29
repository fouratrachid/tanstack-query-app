import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { authApi } from '../api/auth';
import { useAuthStore, selectIsAuthenticated } from '../store/auth.store';
import { getErrorMessage } from '../api/client';
import type { LoginCredentials, SignupCredentials } from '../types/auth.types';

export const useAuth = () => {
    const router = useRouter();
    const segments = useSegments();
    const queryClient = useQueryClient();

    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const { setAuth, logout: logoutStore, user } = useAuthStore();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken, data.refreshToken);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login error:', getErrorMessage(error));
        },
    });

    // Signup mutation
    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken, data.refreshToken);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Signup error:', getErrorMessage(error));
        },
    });

    // User query - only enabled when authenticated
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getUser,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            logoutStore();
            queryClient.clear();
            router.replace('/(auth)/login');
        },
        onError: (error) => {
            // Even if logout fails on backend, clear local state
            console.error('Logout error:', getErrorMessage(error));
            logoutStore();
            queryClient.clear();
            router.replace('/(auth)/login');
        },
    });

    // Navigation guard - redirect based on auth state
    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated and trying to access protected route
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated and trying to access auth screens
            router.replace('/(app)/home');
        }
    }, [isAuthenticated, segments]);

    return {
        // State
        isAuthenticated,
        user,

        // Login
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        // Signup
        signup: signupMutation.mutate,
        signupAsync: signupMutation.mutateAsync,
        isSigningUp: signupMutation.isPending,
        signupError: signupMutation.error,

        // Logout
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,

        // User query
        isLoadingUser: userQuery.isLoading,
        userError: userQuery.error,
        refetchUser: userQuery.refetch,
    };
};

// Hook for login form
export const useLogin = () => {
    const { login, loginAsync, isLoggingIn, loginError } = useAuth();

    return {
        login,
        loginAsync,
        isLoading: isLoggingIn,
        error: loginError,
    };
};

// Hook for signup form
export const useSignup = () => {
    const { signup, signupAsync, isSigningUp, signupError } = useAuth();

    return {
        signup,
        signupAsync,
        isLoading: isSigningUp,
        error: signupError,
    };
};

// Hook for logout
export const useLogout = () => {
    const { logout, isLoggingOut } = useAuth();

    return {
        logout,
        isLoading: isLoggingOut,
    };
};
