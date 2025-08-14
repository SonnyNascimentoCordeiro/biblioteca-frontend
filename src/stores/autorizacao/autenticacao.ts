import { acceptHMRUpdate, defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { authService } from 'src/services/auth';
import { extractUserFromToken, extractRolesFromToken, isTokenValid } from 'src/utils/jwt';
import type { AuthRequest, User } from 'src/types/auth';


export const useAutenticacaoStore = defineStore('autenticacao', {
  state: () => ({
    isAuthenticated: false,
    user: null as User | null,
    token: '',
    roles: [] as string[],
    isLoading: false,
    error: '',
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    userRoles: (state) => state.roles,
    userType: (state) => state.user?.userType || '',
    hasError: (state) => !!state.error,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasAnyRole: (state) => (roles: string[]) => roles.some(role => state.roles.includes(role)),
    // Verificações baseadas no userType
    isAdmin: (state) => state.user?.userType === 'A',
    isCliente: (state) => state.user?.userType === 'C',
    hasUserType: (state) => (userType: string) => state.user?.userType === userType,
  },

  actions: {
    /**
     * Realiza login do usuário
     */
    async login(credentials: AuthRequest): Promise<boolean> {
      this.isLoading = true;
      this.error = '';

      try {
        const authResponse = await authService.login(credentials);

        // Extrair informações do token JWT
        const userFromToken = extractUserFromToken(authResponse.token);
        const rolesFromToken = extractRolesFromToken(authResponse.token);

        // Armazenar dados no estado
        this.token = authResponse.token;
        this.isAuthenticated = true;
        this.roles = rolesFromToken;
        this.user = {
          email: authResponse.email,
          userType: authResponse.userType,
          roles: rolesFromToken,
          username: userFromToken?.sub || '',
        };

        // Armazenar no LocalStorage
        LocalStorage.set('auth_token', authResponse.token);
        LocalStorage.set('user_data', this.user);
        LocalStorage.set('user_roles', rolesFromToken);
        LocalStorage.set('token_expires_in', authResponse.expiresIn);
        LocalStorage.set('token_type', authResponse.tokenType);

        // Configurar token no Axios
        authService.setAuthToken(authResponse.token);

        console.log('✅ Login realizado com sucesso:', {
          email: this.user.email,
          userType: this.user.userType,
          roles: this.roles,
          tokenValid: isTokenValid(authResponse.token)
        });

        this.isLoading = false;
        return true;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao fazer login';
        this.isLoading = false;
        console.error('Erro no login:', error);
        return false;
      }
    },

    /**
     * Realiza logout do usuário
     */
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = '';
      this.roles = [];
      this.error = '';

      // Remover do LocalStorage
      LocalStorage.remove('auth_token');
      LocalStorage.remove('user_data');
      LocalStorage.remove('user_roles');
      LocalStorage.remove('token_expires_in');
      LocalStorage.remove('token_type');

      // Remover token do Axios
      authService.removeAuthToken();

      console.log('✅ Logout realizado com sucesso');
    },

    /**
     * Inicializa autenticação a partir do LocalStorage
     */
    initAuth() {
      const token = LocalStorage.getItem('auth_token') as string;
      const userData = LocalStorage.getItem('user_data') as User;
      const userRoles = LocalStorage.getItem('user_roles') as string[];

      if (token && userData) {
        // Verificar se o token ainda é válido
        if (isTokenValid(token)) {
          this.token = token;
          this.user = userData;
          this.roles = userRoles || [];
          this.isAuthenticated = true;
          authService.setAuthToken(token);

          console.log('✅ Autenticação restaurada:', {
            email: this.user.email,
            roles: this.roles,
            tokenValid: true
          });
        } else {
          // Token expirado, fazer logout
          console.log('⚠️ Token expirado, fazendo logout automático');
          this.logout();
        }
      }
    },

    /**
     * Limpa mensagens de erro
     */
    clearError() {
      this.error = '';
    },

    /**
     * Testa se o usuário tem uma role específica
     */
    testaRole(role: string): boolean {
      return this.roles.some((r: string) => r === role);
    },

    /**
     * Testa se o usuário tem qualquer uma das roles especificadas
     */
    temQualquerRole(roles: string[]): boolean {
      return roles.some(role => this.testaRole(role));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAutenticacaoStore, import.meta.hot));
}
