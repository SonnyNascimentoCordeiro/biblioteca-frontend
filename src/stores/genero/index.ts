import { defineStore } from 'pinia'
import { generoService } from 'src/services/genero'
import type { Genero, GeneroRequest, GeneroFiltro } from 'src/types/genero'
import type { Paginacao } from 'src/model/Paginacao'

export interface GeneroState {
  registros: Genero[]
  generoSelecionado: Genero | null
  isLoading: boolean
  error: string | null
  filtro: GeneroFiltro
  paginacao: Paginacao
}

export const useGeneroStore = defineStore('genero', {
  state: (): GeneroState => ({
    registros: [],
    generoSelecionado: null,
    isLoading: false,
    error: null,
    filtro: {
      filtros: {},
      ordenacao: 'nome',
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
    genero: (state) => state.generoSelecionado,
    podeIncluir: (state) => !state.isLoading,
    podeEditar: (state) => !state.isLoading && !!state.generoSelecionado,
    podeExcluir: (state) => !state.isLoading && !!state.generoSelecionado
  },

  actions: {
    /**
     * Buscar gênero por ID
     */
    async buscarPorId(id: number): Promise<Genero> {
      try {
        const genero = await generoService.buscarPorId(id)
        this.generoSelecionado = genero
        return genero
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar gênero'
        throw error
      }
    },

    /**
     * Criar novo gênero
     */
    async criar(genero: GeneroRequest): Promise<Genero> {
      try {
        const novoGenero = await generoService.criar(genero)
        
        // Adicionar à lista se estiver na primeira página
        if (this.paginacao.paginaAtual === 0) {
          this.registros.unshift(novoGenero)
        }
        
        console.log('✅ Gênero criado:', novoGenero.nome)
        return novoGenero
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar gênero'
        throw error
      }
    },

    /**
     * Atualizar gênero existente
     */
    async atualizar(id: number, genero: Partial<Genero>): Promise<Genero> {
      try {
        const generoRequest: GeneroRequest = {
          nome: genero.nome || '',
          descricao: genero.descricao || ''
        }
        
        const generoAtualizado = await generoService.atualizar(id, generoRequest)
        
        // Atualizar na lista
        const index = this.registros.findIndex(g => g.id === id)
        if (index !== -1) {
          this.registros[index] = generoAtualizado
        }
        
        // Atualizar selecionado se for o mesmo
        if (this.generoSelecionado?.id === id) {
          this.generoSelecionado = generoAtualizado
        }
        
        console.log('✅ Gênero atualizado:', generoAtualizado.nome)
        return generoAtualizado
      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar gênero'
        throw error
      }
    },

    /**
     * Excluir gênero
     */
    async excluir(id: number): Promise<void> {
      try {
        console.log('🗑️ Store: Iniciando exclusão do gênero ID:', id);
        await generoService.excluir(id)
        
        // Remover da lista
        const index = this.registros.findIndex(g => g.id === id)
        if (index !== -1) {
          this.registros.splice(index, 1)
        }
        
        // Limpar selecionado se for o mesmo
        if (this.generoSelecionado?.id === id) {
          this.generoSelecionado = null
        }
        
        console.log('✅ Gênero excluído com sucesso')
      } catch (error: unknown) {
        console.error('❌ Store: Erro ao excluir gênero:', error);
        
        // Capturar a mensagem de erro apropriada
        let errorMessage = 'Erro ao excluir gênero';
        
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
     * Pesquisar gêneros
     */
    async pesquisar(filtro: Partial<GeneroFiltro>): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        
        // Atualizar filtro da store
        this.filtro = { ...this.filtro, ...filtro }
        
        const resultado = await generoService.pesquisar(this.filtro)
        
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
     * Selecionar gênero
     */
    selecionarGenero(genero: Genero) {
      this.generoSelecionado = genero
    },

    /**
     * Limpar gênero selecionado
     */
    limparSelecao() {
      this.generoSelecionado = null
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
      this.generoSelecionado = null
      this.isLoading = false
      this.error = null
      this.filtro = {
        filtros: {},
        ordenacao: 'nome',
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
