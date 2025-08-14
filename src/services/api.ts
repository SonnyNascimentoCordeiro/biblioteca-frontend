import axios, { type AxiosInstance } from 'axios';
import { LocalStorage } from 'quasar';

// Configuração da URL base da API
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8090/biblioteca';

// Criar instância do Axios para a API
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem('auth_token') as string;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token adicionado ao header:', token.substring(0, 20) + '...');
      console.log('📡 Fazendo requisição para:', config.url);

      // Decodificar e mostrar o conteúdo do token para debug
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3 && tokenParts[1]) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('🔍 Payload do token:', payload);
          console.log('🎭 Authorities/Roles no token:', {
            authorities: payload.authorities,
            roles: payload.roles,
            scope: payload.scope,
            userType: payload.userType,
            sub: payload.sub
          });
        }
      } catch (e) {
        console.log(' Erro ao decodificar token:', e);
      }
    } else {
      console.log('⚠️ Nenhum token encontrado no LocalStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

// Interceptor para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('🚨 Erro na resposta da API:', error);

    // Se receber 401 (Unauthorized), fazer logout e redirecionar para login
    if (error.response?.status === 401) {
      // Limpar token
      LocalStorage.remove('auth_token');

      // Redirecionar para login se estiver em uma rota protegida
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Capturar mensagem de erro customizada do backend
    let errorMessage = 'Erro na requisição';

    if (error.response?.data) {
      // Se o backend retornou dados no corpo da resposta
      if (error.response.data.message) {
        // Usar a mensagem customizada do backend
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        // Fallback para campo 'error'
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data === 'string') {
        // Se o corpo da resposta for uma string
        errorMessage = error.response.data;
      }
    } else if (error.message) {
      // Usar mensagem do Axios se não houver dados da resposta
      errorMessage = error.message;
    }

    // Log detalhado para debug
    console.error('📋 Detalhes do erro:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      responseData: error.response?.data,
      errorMessage: errorMessage
    });

    // Rejeitar com a mensagem de erro apropriada
    return Promise.reject(new Error(errorMessage));
  }
);
