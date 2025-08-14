import {jwtDecode} from 'jwt-decode';
import type {JwtPayload} from 'src/types/auth';

/**
 * Decodifica um token JWT e retorna o payload
 */
export function decodeJwtToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se o token JWT ainda é válido (não expirou)
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) return false;

    const currentTime = Date.now() / 1000; // tempo atual em segundos
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Erro ao verificar validade do token:', error);
    return false;
  }
}


export function extractRolesFromToken(token: string): string[] {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) return [];

    console.log('🔍 Token decodificado:', decoded);


    const roles = decoded.roles || decoded.authorities || [];

    console.log('🎭 Roles encontradas no token:', roles);

    if (Array.isArray(roles)) {
      const processedRoles = roles.map(role =>
        typeof role === 'string' ? role.replace(/^ROLE_/, '') : role
      );
      console.log('🎭 Roles processadas:', processedRoles);
      return processedRoles;
    }

    if (decoded.userType) {
      console.log('👤 UserType encontrado:', decoded.userType);
      return [decoded.userType];
    }

    return [];
  } catch (error) {
    console.error('Erro ao extrair roles do token:', error);
    return [];
  }
}

/**
 * Extrai informações do usuário do token JWT
 */
export function extractUserFromToken(token: string): Partial<JwtPayload> | null {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) return null;

    return {
      sub: decoded.sub,
      email: decoded.email,
      userType: decoded.userType,
      roles: extractRolesFromToken(token),
    };
  } catch (error) {
    console.error('Erro ao extrair dados do usuário do token:', error);
    return null;
  }
}
