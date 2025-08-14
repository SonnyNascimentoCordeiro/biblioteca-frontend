export interface Genero {
  id: number
  nome: string
  descricao: string
  criacao: string
}

export interface GeneroRequest {
  nome: string
  descricao: string
}

export interface GeneroResponse {
  id: number
  nome: string
  descricao: string
  criacao: string
}

export interface GeneroFiltro {
  filtros: { nome?: string; descricao?: string }
  ordenacao: string
  limite: number
  offset: number
  page: number
  size: number
}

export interface PaginaResultado<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}
