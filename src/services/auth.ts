import { api } from './api';
import type { AuthRequest, AuthResponse, RetornoApi } from 'src/types/auth';

export const authService = {
  /**
   * Realiza login na API
   */
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<RetornoApi<AuthResponse>>(
      'api/auth/login',
      credentials
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro no login');
    }
  },

  /**
   * Configura o token no header das requisições
   */
  setAuthToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  /**
   * Remove o token do header das requisições
   */
  removeAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  },
};
