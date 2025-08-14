// Tipos para autenticação
export interface AuthRequest {
  /** Username do usuário */
  username: string;
  /** Senha do usuário */
  senha: string;
}

export interface AuthResponse {
  /** Token JWT de acesso */
  token: string;
  /** Tipo do token */
  tokenType: string;
  /** Tempo de expiração em segundos */
  expiresIn: number;
  /** Tipo de usuário */
  userType: string;
  /** Email do usuário */
  email: string;
}

export interface RetornoApi<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface User {
  email: string;
  userType: string;
  roles?: string[];
  username?: string;
}

// Interface para o payload decodificado do JWT
export interface JwtPayload {
  sub: string; // subject (username)
  email: string;
  userType: string;
  roles?: string[];
  authorities?: string[];
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}
