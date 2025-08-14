import { api } from './api';
import type {
  Livro,
  PaginaResultado,
  LivroRequest,
  LivroResponse
} from 'src/types/livro';
import type { LivroFiltro } from 'src/types/livro';
import type { RetornoApi } from 'src/types/auth';

const BASE_URL = '/api/v1/livros';

export const livroService = {

  /**
   * Pesquisar livros com filtros
   */
  async pesquisar(filtro: LivroFiltro): Promise<PaginaResultado<Livro>> {
    console.log('🔍 Iniciando pesquisa de livros...');
    console.log('📋 Filtros enviados:', filtro);
    console.log('🌐 URL da requisição:', `${BASE_URL}/pesquisar`);

    try {
      const response = await api.post<RetornoApi<PaginaResultado<Livro>>>(
        `${BASE_URL}/pesquisar`,
        filtro
      );

      console.log('✅ Resposta recebida:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error(' Erro na resposta da API:', response.data.message);
        throw new Error(response.data.message || 'Erro na pesquisa de livros');
      }
    } catch (error) {
      console.error(' Erro na requisição de pesquisa:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido na pesquisa de livros');
      }
    }
  },

  /**
   * Buscar livro por ID
   */
  async buscarPorId(id: number): Promise<Livro> {
    console.log('🔍 Buscando livro por ID:', id);

    try {
      const response = await api.get<RetornoApi<Livro>>(`${BASE_URL}/${id}`);
      console.log('✅ Resposta da busca:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar livro');
      }
    } catch (error) {
      console.error(' Erro ao buscar livro:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao buscar livro');
      }
    }
  },

  /**
   * Criar novo livro
   */
  async criar(livro: LivroRequest): Promise<Livro> {
    console.log('➕ Criando novo livro:', livro);

    try {
      const response = await api.post<RetornoApi<LivroResponse>>(
        BASE_URL,
        livro
      );
      console.log('✅ Resposta da criação:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar livro');
      }
    } catch (error) {
      console.error(' Erro ao criar livro:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao criar livro');
      }
    }
  },

  /**
   * Atualizar livro existente
   */
  async atualizar(id: number, livro: LivroRequest): Promise<Livro> {
    console.log('✏️ Atualizando livro ID:', id, 'com dados:', livro);

    try {
      const response = await api.put<RetornoApi<LivroResponse>>(
        `${BASE_URL}/${id}`,
        livro
      );
      console.log('✅ Resposta da atualização:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar livro');
      }
    } catch (error) {
      console.error(' Erro ao atualizar livro:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao atualizar livro');
      }
    }
  },

  /**
   * Excluir livro
   */
  async excluir(id: number): Promise<void> {
    console.log('🗑️ Iniciando exclusão do livro ID:', id);

    try {
      const response = await api.delete<RetornoApi<void>>(`${BASE_URL}/${id}`);
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
        throw new Error(response.data.message || 'Erro ao excluir livro');
      }

      // Se chegou até aqui, considerar como sucesso
      console.log('✅ Exclusão confirmada como bem-sucedida');

    } catch (error) {
      console.error(' Erro na exclusão do livro:', error);

      // Se for um erro HTTP com mensagem customizada, preservar a mensagem
      if (error instanceof Error) {
        throw error; // Re-throw para manter a mensagem original
      } else {
        throw new Error('Erro desconhecido ao excluir livro');
      }
    }
  },

  /**
   * Listar todos os livros (para selects)
   */
  async listarTodos(): Promise<Livro[]> {
    const filtro: LivroFiltro = {
      filtros: {},
      page: 0,
      size: 1000, // Buscar muitos para selects
      ordenacao: 'titulo',
      offset: 0,
      limite: 1000
    };

    const resultado = await this.pesquisar(filtro);
    return resultado.content;
  }
};
