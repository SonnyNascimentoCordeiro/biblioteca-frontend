export interface Usuario {
  id: number
  nome: string
  username: string
  email: string
  senha: string
}

export interface UsuarioRegistro {
  id: number
  nome: string
  username: string
  email: string
  senha: string
}

export interface UsuarioLogin {
  username: string
  senha: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  username: string
  email: string
  // senha não é retornado na resposta
}

// Resposta de login do backend (estrutura real)
export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  userType: string
  email: string
}

// Resposta de registro do backend
export interface RegistroResponse {
  id: number
  nome: string
  username: string
  email: string
  // senha não é retornado
}
