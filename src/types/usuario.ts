export interface Usuario {
  id: number
  nome: string
  cargo: string
  senha: string
  username: string
  email: string
  criacao: string
  edicao: string
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
  cargo: string
  criacao: string
  edicao: string
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
  cargo: string
  criacao: string
  edicao: string
  // senha não é retornado
}

// Filtros para pesquisa de usuários
export interface UsuarioFiltros {
  nome?: string | undefined
  username?: string | undefined
  email?: string | undefined
  cargo?: string | undefined
}

// Parâmetros de pesquisa de usuários
export interface UsuarioPesquisaParams {
  filtros: UsuarioFiltros
  page: number
  size: number
  ordenacao?: string
  offset: number
}

// Interface para o cargo
export interface Cargo {
  codigo: string
  descricao: string
}

// Opções de cargo disponíveis
export const CARGOS_DISPONIVEIS: Cargo[] = [
  { codigo: 'C', descricao: 'Cliente' },
  { codigo: 'F', descricao: 'Funcionário' }
]
