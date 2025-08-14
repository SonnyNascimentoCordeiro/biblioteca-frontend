// Tipos para Livro
export interface Livro {
  /** ID único do livro */
  id: number;
  /** ID do gênero associado */
  idGenero: number;
  /** ID do autor associado */
  idAutor: number;
  /** Título do livro */
  titulo: string;
  /** Descrição do livro */
  descricao: string;
  /** Linguagem do livro */
  linguagem: string;
  /** Quantidade de unidades disponíveis */
  qtdUnidade: number;
  /** Data de criação */
  criacao: string;
  /** Data da última edição */
  edicao: string;
}

export interface LivroRequest {
  /** ID do gênero associado */
  idGenero: number;
  /** ID do autor associado */
  idAutor: number;
  /** Título do livro */
  titulo: string;
  /** Descrição do livro */
  descricao: string;
  /** Linguagem do livro */
  linguagem: string;
  /** Quantidade de unidades disponíveis */
  qtdUnidade: number;
}

export interface LivroResponse {
  /** ID único do livro */
  id: number;
  /** ID do gênero associado */
  idGenero: number;
  /** ID do autor associado */
  idAutor: number;
  /** Título do livro */
  titulo: string;
  /** Descrição do livro */
  descricao: string;
  /** Linguagem do livro */
  linguagem: string;
  /** Quantidade de unidades disponíveis */
  qtdUnidade: number;
  /** Data de criação */
  criacao: string;
  /** Data da última edição */
  edicao: string;
}

export interface LivroFiltro {
  /** Filtros específicos */
  filtros: {
    titulo?: string;
    descricao?: string;
    linguagem?: string;
    idGenero?: number;
    idAutor?: number;
  };
  /** Número da página (começa em 0) */
  page: number;
  /** Tamanho da página */
  size: number;
  /** Campo de ordenação */
  ordenacao: string;
  /** Offset para paginação */
  offset: number;
  /** Limite de registros */
  limite: number;
}

export interface PaginaResultado<T> {
  /** Conteúdo da página */
  content: T[];
  /** Número da página atual */
  number: number;
  /** Tamanho da página */
  size: number;
  /** Número total de elementos */
  totalElements: number;
  /** Número total de páginas */
  totalPages: number;
  /** Número de elementos na página atual */
  numberOfElements: number;
  /** Se é a primeira página */
  first: boolean;
  /** Se é a última página */
  last: boolean;
}
