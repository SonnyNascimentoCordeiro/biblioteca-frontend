import {acceptHMRUpdate, defineStore} from 'pinia';
import {autorService} from 'src/services/autor';
import type {Autor, AutorRequest, PaginaResultado} from 'src/types/autor';
import {Paginacao} from "src/model/Paginacao";
import {Autor as AutorClass, AutorFiltro, type AutorState} from "src/model/catalogo/Autor";
import {useAutenticacaoStore} from "stores/autorizacao/autenticacao";
import {cloneDeep} from 'lodash-es';

export const useAutorStore = defineStore('autor', {
  state: (): AutorState => ({
    registros: [],
    autorSelecionado: new AutorClass(),
    autoresAtivos: [],
    filtro: new AutorFiltro(),
    paginacao: new Paginacao(0, 0, 0, 0, false),
    isLoading: false,
    error: '',
    auth: useAutenticacaoStore(),
  }),

  getters: {
    autor(state) {
      if (state.autorSelecionado) {
        return cloneDeep(state.autorSelecionado)
      } else {
        return new AutorClass()
      }
    },
    podeIncluir(state) {
      return state.auth.testaRole('A')
    },
    podeAlterar(state) {
      return state.auth.testaRole('A')
    },
    podeExcluir(state) {
      return state.auth.testaRole('A')
    },
    hasError(state) {
      return !!state.error;
    },
  },

  actions: {
    /**
     * Pesquisar autores
     */
    async pesquisar(filtro?: Partial<AutorFiltro>) {
      this.isLoading = true;
      this.error = '';

      try {
        // Mesclar filtro atual com novo filtro
        this.filtro = {
          ...this.filtro,
          ...filtro,
        };
        console.log('Termo de pesquisa:', this.filtro);
        const resultado = await autorService.pesquisar(this.filtro);
        this.SET_AUTORES(resultado);

        console.log('✅ Pesquisa de autores realizada:', {
          total: this.paginacao.totalRegistros,
          pagina: this.paginacao.paginaAtual + 1,
          resultados: this.registros.length
        });

        return resultado;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro na pesquisa';
        console.error('Erro na pesquisa de autores:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Buscar autor por ID
     */
    async buscarPorId(id: number) {
      this.isLoading = true;
      this.error = '';

      try {
        const autor = await autorService.buscarPorId(id);
        this.autorSelecionado = autor;
        return autor;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar autor';
        console.error('Erro ao buscar autor:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Criar novo autor
     */
    async criar(autorData: AutorRequest) {
      this.isLoading = true;
      this.error = '';

      try {
        const novoAutor = await autorService.criar(autorData);

        // Adicionar à lista se estiver na primeira página
        if (this.paginacao.paginaAtual === 0) {
          this.registros.unshift(novoAutor);
        }

        console.log('✅ Autor criado:', novoAutor.nome);
        return novoAutor;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar autor';
        console.error('Erro ao criar autor:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Atualizar autor existente
     */
    async atualizar(id: number, autorData: Partial<Autor>) {
      this.isLoading = true;
      this.error = '';

      try {
        // Converter para AutorRequest
        const autorRequest: AutorRequest = {
          nome: autorData.nome || ''
        };

        const autorAtualizado = await autorService.atualizar(id, autorRequest);

        // Atualizar na lista
        const index = this.registros.findIndex(a => a.id === id);
        if (index !== -1) {
          this.registros[index] = autorAtualizado;
        }

        // Atualizar selecionado se for o mesmo
        if (this.autorSelecionado?.id === id) {
          this.autorSelecionado = autorAtualizado;
        }

        console.log('✅ Autor atualizado:', autorAtualizado.nome);
        return autorAtualizado;
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar autor';
        console.error('Erro ao atualizar autor:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Excluir autor
     */
    async excluir(id: number) {
      this.isLoading = true;
      this.error = '';

      try {
        console.log('🗑️ Store: Iniciando exclusão do autor ID:', id);
        await autorService.excluir(id);

        // Remover da lista
        this.registros = this.registros.filter(a => a.id !== id);

        // Limpar selecionado se for o mesmo
        if (this.autorSelecionado?.id === id) {
          this.autorSelecionado = null;
        }

        console.log('✅ Autor excluído:', id);
      } catch (error: unknown) {
        console.error(' Store: Erro ao excluir autor:', error);

        // Capturar a mensagem de erro apropriada
        let errorMessage = 'Erro ao excluir autor';

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        }

        this.error = errorMessage;
        console.log('📝 Mensagem de erro definida no store:', errorMessage);

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Salvar autor (criar ou atualizar)
     */
    async salvar(autorData: Autor) {
      if (autorData.id && autorData.id > 0) {
        return this.atualizar(autorData.id, autorData);
      } else {
        return this.criar(autorData);
      }
    },

    /**
     * Definir autores
     */
    SET_AUTORES(payload: PaginaResultado<Autor>) {
      this.paginacao.paginaAtual = payload.number;
      this.paginacao.totalPaginas = payload.totalPages;
      this.paginacao.registrosCarregados = payload.numberOfElements;
      this.paginacao.totalRegistros = payload.totalElements;
      this.paginacao.ultima = payload.last;
      this.registros = payload.content;
      console.log(this.registros, 'Registro')
    },

    /**
     * Selecionar autor
     */
    selecionarAutor(autor: Autor) {
      this.autorSelecionado = autor;
    },

    /**
     * Limpar seleção
     */
    limparSelecao() {
      this.autorSelecionado = null;
    },

    /**
     * Limpar erro
     */
    limparErro() {
      this.error = '';
    },

    /**
     * Resetar estado
     */
    reset() {
      this.registros = [];
      this.autorSelecionado = new AutorClass();
      this.autoresAtivos = [];
      this.filtro = new AutorFiltro();
      this.paginacao = new Paginacao(0, 0, 0, 0, false);
      this.isLoading = false;
      this.error = '';
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAutorStore, import.meta.hot));
}
