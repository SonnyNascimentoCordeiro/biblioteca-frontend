// Tipos para sistema de autores

export interface Autor {
  id: number;
  nome: string;
  criacao: string;
  edicao: string;
}

export interface FiltroPesquisa {
  termo?: string;
  nome?: string;
  pagina?: number;
  tamanho?: number;
  ordenacao?: string;
  direcao?: 'ASC' | 'DESC';
}

export interface PaginaResultado<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface AutorRequest {
  nome: string;
  nacionalidade?: string;
  dataNascimento?: string;
  biografia?: string;
  ativo?: boolean;
}

export type AutorResponse = Autor;
