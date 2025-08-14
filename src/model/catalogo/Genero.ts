import type {useAutenticacaoStore} from "src/stores/autorizacao/autenticacao";

export class Genero {
  id: number = 0
  nome: string = ''
  descricao: string = ''
  criacao: string = ''

  constructor(genero?: Partial<Genero>) {
    if (genero) {
      this.id = genero.id ?? 0
      this.nome = genero.nome ?? ''
      this.descricao = genero.descricao ?? ''
      this.criacao = genero.criacao ?? ''
    }
  }
}

export class GeneroFiltro {
  filtros: { nome?: string; descricao?: string } = {}
  ordenacao: string = 'nome'
  limite: number = 20
  offset: number = 0
  page: number = 0
  size: number = 20

  constructor(filtro?: Partial<GeneroFiltro>) {
    if (filtro) {
      this.filtros = filtro.filtros ?? {}
      this.ordenacao = filtro.ordenacao ?? 'nome'
      this.limite = filtro.limite ?? 20
      this.offset = filtro.offset ?? 0
      this.page = filtro.page ?? 0
      this.size = filtro.size ?? 20
    }
  }
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


export interface GeneroState {
  registros: Genero[];
  autorSelecionado: Genero | null;
  autoresAtivos: Genero[];
  filtro: GeneroFiltro;
  paginacao: {
    paginaAtual: number;
    totalPaginas: number;
    registrosCarregados: number;
    totalRegistros: number;
    ultima: boolean;
  };
  isLoading: boolean;
  error: string;
  auth: ReturnType<typeof useAutenticacaoStore>;
}
