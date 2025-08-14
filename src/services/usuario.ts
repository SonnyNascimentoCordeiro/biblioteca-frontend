import { api } from './api';
import type { UsuarioResponse, UsuarioPesquisaParams } from 'src/types/usuario';
import type { RetornoApi } from 'src/types/auth';

export const usuarioService = {
  /**
   * Lista usuários com filtros (excluindo administradores)
   */
  async listarUsuarios(params: UsuarioPesquisaParams): Promise<{
    content: UsuarioResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const response = await api.post<RetornoApi<{
      content: UsuarioResponse[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>>('api/v1/usuarios/pesquisar', {
      ...params,
      filtros: {
        ...params.filtros
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao listar usuários');
    }
  },

  /**
   * Busca usuário por ID
   */
  async buscarPorId(id: number): Promise<UsuarioResponse> {
    const response = await api.get<RetornoApi<UsuarioResponse>>(`api/v1/usuarios/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao buscar usuário');
    }
  },

  /**
   * Cria novo usuário
   */
  async criar(usuario: {
    nome: string;
    username: string;
    email: string;
    cargo: string;
    senha: string;
  }): Promise<UsuarioResponse> {
    console.log('🔍 Dados sendo enviados para criação:', usuario);
    console.log('🔐 Token atual:', localStorage.getItem('auth_token')?.substring(0, 20) + '...');
    
    const response = await api.post<RetornoApi<UsuarioResponse>>('api/v1/usuarios', usuario);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao criar usuário');
    }
  },

  /**
   * Atualiza usuário existente
   */
  async atualizar(id: number, usuario: {
    nome: string;
    username: string;
    email: string;
    cargo: string;
  }): Promise<UsuarioResponse> {
    const response = await api.put<RetornoApi<UsuarioResponse>>(`api/v1/usuarios/${id}`, usuario);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao atualizar usuário');
    }
  },

  /**
   * Exclui usuário
   */
  async excluir(id: number): Promise<void> {
    console.log('🗑️ Iniciando exclusão do usuário ID:', id);

    try {
      const response = await api.delete<RetornoApi<void>>(`api/v1/usuarios/${id}`);
      console.log('✅ Resposta da exclusão:', response.data);
      console.log('📊 Status da resposta:', response.status);
      console.log('🔍 Estrutura da resposta:', {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        hasData: 'data' in response.data
      });

      // Para operações DELETE, o sucesso pode ser indicado por diferentes status HTTP
      if (response.status === 204) {
        // HTTP 204 No Content - exclusão bem-sucedida
        console.log('✅ Exclusão confirmada (HTTP 204)');
        return;
      }

      // Se não for 204, verificar o campo success da resposta
      if (response.data && response.data.success === false) {
        // Se explicitamente marcado como false, lançar erro
        throw new Error(response.data.message || 'Erro ao excluir usuário');
      }

      // Se chegou até aqui, considerar como sucesso
      console.log('✅ Exclusão confirmada como bem-sucedida');

    } catch (error) {
      console.error('❌ Erro na exclusão do usuário:', error);

      // Se for um erro HTTP com mensagem customizada, preservar a mensagem
      if (error instanceof Error) {
        throw error; // Re-throw para manter a mensagem original
      } else {
        throw new Error('Erro desconhecido ao excluir usuário');
      }
    }
  }
};
