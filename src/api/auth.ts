import { apiClient } from './client';
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
    User,
} from '../types/auth.types';

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
        return response.data;
    },

    getUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
};
