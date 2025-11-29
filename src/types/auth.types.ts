export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
