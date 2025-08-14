import type {useAutenticacaoStore} from "stores/autorizacao/autenticacao";

export class Autor {
  id: number = 0
  nome: string = ''
  criacao: string = ''
  edicao: string = ''

  constructor(autor?: Partial<Autor>) {
    if (autor) {
      this.id = autor.id ?? 0
      this.nome = autor.nome ?? ''
      this.criacao = autor.criacao ?? ''
      this.edicao = autor.edicao ?? ''
    }
  }
}


export class AutorFiltro {
  filtros: { nome?: string } = {}  // ✅ Map<String, Object> filtros
  ordenacao: string = 'nome'       // ✅ String ordenacao
  limite: number = 20              // ✅ Integer limite
  offset: number = 0               // ✅ Integer offset
  page: number = 0                 // ✅ Integer page (começa em 0)
  size: number = 20                // ✅ Integer size (padrão 20)

  constructor(filtro?: Partial<AutorFiltro>) {
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

export interface AutorState {
  registros: Autor[];
  autorSelecionado: Autor | null;
  autoresAtivos: Autor[];
  filtro: AutorFiltro;
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
