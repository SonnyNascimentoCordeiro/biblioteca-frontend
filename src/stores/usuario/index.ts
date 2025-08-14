import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usuarioService } from 'src/services/usuario'
import type { UsuarioResponse, UsuarioPesquisaParams } from 'src/types/usuario'
import { Paginacao } from 'src/model/Paginacao'

export const useUsuarioStore = defineStore('usuario', () => {
  // State
  const registros = ref<UsuarioResponse[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const paginacao = ref(new Paginacao())

  // Getters
  const hasError = computed(() => !!error.value)
  const totalRegistros = computed(() => paginacao.value.totalRegistros)
  const registrosCarregados = computed(() => paginacao.value.registrosCarregados)

  // Actions
  function limparErro() {
    error.value = ''
  }

  function reset() {
    registros.value = []
    paginacao.value = new Paginacao()
    error.value = ''
  }

  async function pesquisar(params: UsuarioPesquisaParams) {
    isLoading.value = true
    error.value = ''

    try {
      console.log('🔍 Iniciando pesquisa de usuários com params:', params)
      const resultado = await usuarioService.listarUsuarios(params)
      
      console.log('📊 Resultado da API:', resultado)
      console.log('📋 Content recebido:', resultado.content)
      
      registros.value = resultado.content
      paginacao.value.paginaAtual = resultado.number
      paginacao.value.totalPaginas = resultado.totalPages
      paginacao.value.registrosCarregados = resultado.size
      paginacao.value.totalRegistros = resultado.totalElements
      paginacao.value.ultima = resultado.number >= resultado.totalPages - 1

      console.log('✅ Usuários carregados:', {
        total: resultado.totalElements,
        registros: resultado.content.length,
        pagina: resultado.number + 1,
        registrosAtualizados: registros.value
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao pesquisar usuários'
      console.error('❌ Erro na pesquisa de usuários:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function buscarPorId(id: number): Promise<UsuarioResponse> {
    isLoading.value = true
    error.value = ''

    try {
      const usuario = await usuarioService.buscarPorId(id)
      console.log('✅ Usuário encontrado:', usuario)
      return usuario
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar usuário'
      console.error('❌ Erro ao buscar usuário:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function criar(usuario: {
    nome: string;
    username: string;
    email: string;
    cargo: string;
    senha: string;
  }) {
    isLoading.value = true
    error.value = ''

    try {
      const novoUsuario = await usuarioService.criar(usuario)
      registros.value.unshift(novoUsuario)
      
      console.log('✅ Usuário criado:', novoUsuario)
      return novoUsuario
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar usuário'
      console.error('❌ Erro ao criar usuário:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function atualizar(id: number, usuario: {
    nome: string;
    username: string;
    email: string;
    cargo: string;
  }) {
    isLoading.value = true
    error.value = ''

    try {
      const usuarioAtualizado = await usuarioService.atualizar(id, usuario)
      const index = registros.value.findIndex((u: UsuarioResponse) => u.id === id)
      
      if (index !== -1) {
        registros.value[index] = usuarioAtualizado
      }
      
      console.log('✅ Usuário atualizado:', usuarioAtualizado)
      return usuarioAtualizado
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar usuário'
      console.error('❌ Erro ao atualizar usuário:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function excluir(id: number) {
    isLoading.value = true
    error.value = ''

    try {
      await usuarioService.excluir(id)
      registros.value = registros.value.filter((u: UsuarioResponse) => u.id !== id)
      
      console.log('✅ Usuário excluído:', id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao excluir usuário'
      console.error('❌ Erro ao excluir usuário:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    registros,
    isLoading,
    error,
    paginacao,
    
    // Getters
    hasError,
    totalRegistros,
    registrosCarregados,
    
    // Actions
    limparErro,
    reset,
    pesquisar,
    buscarPorId,
    criar,
    atualizar,
    excluir
  }
})
