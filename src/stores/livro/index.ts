import { defineStore } from 'pinia'
import { livroService } from 'src/services/livro'
import type { Livro, LivroRequest, LivroFiltro } from 'src/types/livro'
import type { Paginacao } from 'src/model/Paginacao'

export interface LivroState {
  registros: Livro[]
  livroSelecionado: Livro | null
  isLoading: boolean
  error: string | null
  filtro: LivroFiltro
  paginacao: Paginacao
}

export const useLivroStore = defineStore('livro', {
  state: (): LivroState => ({
    registros: [],
    livroSelecionado: null,
    isLoading: false,
    error: null,
    filtro: {
      filtros: {},
      ordenacao: 'titulo',
      limite: 20,
      offset: 0,
      page: 0,
      size: 20
    },
    paginacao: {
      paginaAtual: 0,
      totalRegistros: 0,
      registrosCarregados: 0,
      totalPaginas: 0,
      ultima: false,
      scrollPosition: 0,
      scrollTo: () => {
        // Implementação do scrollTo
      }
    }
  }),

  getters: {
    livro: (state) => state.livroSelecionado,
    podeIncluir: (state) => !state.isLoading,
    podeEditar: (state) => !state.isLoading && !!state.livroSelecionado,
    podeExcluir: (state) => !state.isLoading && !!state.livroSelecionado
  },

  actions: {
    /**
     * Buscar livro por ID
     */
    async buscarPorId(id: number): Promise<Livro> {
      try {
        const livro = await livroService.buscarPorId(id)
        this.livroSelecionado = livro
        return livro
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar livro'
        throw error
      }
    },

    /**
     * Criar novo livro
     */
    async criar(livro: LivroRequest): Promise<Livro> {
      try {
        const novoLivro = await livroService.criar(livro)

        // Adicionar à lista se estiver na primeira página
        if (this.paginacao.paginaAtual === 0) {
          this.registros.unshift(novoLivro)
        }

        console.log('✅ Livro criado:', novoLivro.titulo)
        return novoLivro
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar livro'
        throw error
      }
    },

    /**
     * Atualizar livro existente
     */
    async atualizar(id: number, livro: Partial<Livro>): Promise<Livro> {
      try {
        const livroRequest: LivroRequest = {
          idGenero: livro.idGenero || 0,
          idAutor: livro.idAutor || 0,
          titulo: livro.titulo || '',
          descricao: livro.descricao || '',
          linguagem: livro.linguagem || '',
          qtdUnidade: livro.qtdUnidade || 0
        }

        const livroAtualizado = await livroService.atualizar(id, livroRequest)

        // Atualizar na lista
        const index = this.registros.findIndex(l => l.id === id)
        if (index !== -1) {
          this.registros[index] = livroAtualizado
        }

        // Atualizar selecionado se for o mesmo
        if (this.livroSelecionado?.id === id) {
          this.livroSelecionado = livroAtualizado
        }

        console.log('✅ Livro atualizado:', livroAtualizado.titulo)
        return livroAtualizado
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar livro'
        throw error
      }
    },

    /**
     * Excluir livro
     */
    async excluir(id: number): Promise<void> {
      try {
        console.log('🗑️ Store: Iniciando exclusão do livro ID:', id);
        await livroService.excluir(id)

        // Remover da lista
        const index = this.registros.findIndex(l => l.id === id)
        if (index !== -1) {
          this.registros.splice(index, 1)
        }

        // Limpar selecionado se for o mesmo
        if (this.livroSelecionado?.id === id) {
          this.livroSelecionado = null
        }

        console.log('✅ Livro excluído com sucesso')
      } catch (error: unknown) {
        console.error(' Store: Erro ao excluir livro:', error);

        // Capturar a mensagem de erro apropriada
        let errorMessage = 'Erro ao excluir livro';

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        }

        this.error = errorMessage;
        console.log('📝 Mensagem de erro definida no store:', errorMessage);

        // Re-lançar o erro para que o componente possa tratá-lo
        throw error
      }
    },

    /**
     * Pesquisar livros
     */
    async pesquisar(filtro: Partial<LivroFiltro>): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        // Atualizar filtro da store
        this.filtro = { ...this.filtro, ...filtro }

        const resultado = await livroService.pesquisar(this.filtro)

        this.registros = resultado.content
        this.paginacao = {
          paginaAtual: resultado.number,
          totalRegistros: resultado.totalElements,
          registrosCarregados: resultado.size,
          totalPaginas: resultado.totalPages,
          ultima: resultado.last,
          scrollPosition: 0,
          scrollTo: () => {
            // Implementação do scrollTo
          }
        }

        console.log('✅ Pesquisa realizada com sucesso')
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro na pesquisa'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Selecionar livro
     */
    selecionarLivro(livro: Livro) {
      this.livroSelecionado = livro
    },

    /**
     * Limpar livro selecionado
     */
    limparSelecao() {
      this.livroSelecionado = null
    },

    /**
     * Limpar erro
     */
    limparErro() {
      this.error = null
    },

    /**
     * Reset da store
     */
    reset() {
      this.registros = []
      this.livroSelecionado = null
      this.isLoading = false
      this.error = null
      this.filtro = {
        filtros: {},
        ordenacao: 'titulo',
        limite: 20,
        offset: 0,
        page: 0,
        size: 20
      }
      this.paginacao = {
        paginaAtual: 0,
        totalRegistros: 0,
        registrosCarregados: 0,
        totalPaginas: 0,
        ultima: false,
        scrollPosition: 0,
        scrollTo: () => {
          // Implementação do scrollTo
        }
      }
    }
  }
})
