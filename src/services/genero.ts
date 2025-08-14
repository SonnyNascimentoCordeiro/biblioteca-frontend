import { api } from './api';
import type {
  Genero,
  PaginaResultado,
  GeneroRequest,
  GeneroResponse
} from 'src/types/genero';
import type { GeneroFiltro } from 'src/model/catalogo/Genero';
import type { RetornoApi } from 'src/types/auth';

const BASE_URL = '/api/v1/generos';

export const generoService = {

  /**
   * Pesquisar gêneros com filtros
   */
  async pesquisar(filtro: GeneroFiltro): Promise<PaginaResultado<Genero>> {
    console.log('🔍 Iniciando pesquisa de gêneros...');
    console.log('📋 Filtros enviados:', filtro);
    console.log('🌐 URL da requisição:', `${BASE_URL}/pesquisar`);

    try {
      const response = await api.post<RetornoApi<PaginaResultado<Genero>>>(
        `${BASE_URL}/pesquisar`,
        filtro
      );

      console.log('✅ Resposta recebida:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('❌ Erro na resposta da API:', response.data.message);
        throw new Error(response.data.message || 'Erro na pesquisa de gêneros');
      }
    } catch (error) {
      console.error('❌ Erro na requisição de pesquisa:', error);
      throw error;
    }
  },

  /**
   * Buscar gênero por ID
   */
  async buscarPorId(id: number): Promise<Genero> {
    const response = await api.get<RetornoApi<Genero>>(`${BASE_URL}/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao buscar gênero');
    }
  },

  /**
   * Criar novo gênero
   */
  async criar(genero: GeneroRequest): Promise<Genero> {
    const response = await api.post<RetornoApi<GeneroResponse>>(
      BASE_URL,
      genero
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao criar gênero');
    }
  },

  /**
   * Atualizar gênero existente
   */
  async atualizar(id: number, genero: GeneroRequest): Promise<Genero> {
    const response = await api.put<RetornoApi<GeneroResponse>>(
      `${BASE_URL}/${id}`,
      genero
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao atualizar gênero');
    }
  },

  /**
   * Excluir gênero
   */
  async excluir(id: number): Promise<void> {
    console.log('🗑️ Iniciando exclusão do gênero ID:', id);
    
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
        throw new Error(response.data.message || 'Erro ao excluir gênero');
      }
      
      // Se chegou até aqui, considerar como sucesso
      console.log('✅ Exclusão confirmada como bem-sucedida');
      
    } catch (error) {
      console.error('❌ Erro na exclusão do gênero:', error);
      
      // Se for um erro HTTP com mensagem customizada, preservar a mensagem
      if (error instanceof Error) {
        throw error; // Re-throw para manter a mensagem original
      } else {
        throw new Error('Erro desconhecido ao excluir gênero');
      }
    }
  },

  /**
   * Listar todos os gêneros (para selects)
   */
  async listarTodos(): Promise<Genero[]> {
    const filtro: GeneroFiltro = {
      filtros: {},
      page: 0,
      size: 1000, // Buscar muitos para selects
      ordenacao: 'nome',
      offset: 0,
      limite: 1000
    };

    const resultado = await this.pesquisar(filtro);
    return resultado.content;
  }
};
