import { fetchApi } from '../lib/fetch';
import type { AuthResponse, LoginCredentials, RegisterData } from '../types';

interface ProfileResponse {
  success: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: RegisterData): Promise<AuthResponse> =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: (): Promise<ProfileResponse> =>
    fetchApi<ProfileResponse>('/auth/me', { method: 'GET' }),
};
