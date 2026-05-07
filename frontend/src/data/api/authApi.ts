import { apiClient } from '../../core/network/ApiClient';

export interface AuthUserResponse {
  id: string;
  nome: string;
  email: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface RegisterResponse {
  success: boolean;
  user: AuthUserResponse;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUserResponse;
}

export interface MeResponse {
  success: boolean;
  user: AuthUserResponse;
}

export const authApi = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  async me(token: string): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
