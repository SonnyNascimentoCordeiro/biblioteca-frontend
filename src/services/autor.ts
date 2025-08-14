import { api } from './api';
import type {
  Autor,
  PaginaResultado,
  AutorRequest,
  AutorResponse
} from 'src/types/autor';
import type { AutorFiltro } from 'src/model/catalogo/Autor';
import type { RetornoApi } from 'src/types/auth';

const BASE_URL = '/api/v1/autores';

export const autorService = {

  /**
   * Pesquisar autores com filtros
   */
  async pesquisar(filtro: AutorFiltro): Promise<PaginaResultado<Autor>> {
    console.log('🔍 Iniciando pesquisa de autores...');
    console.log('📋 Filtros enviados:', filtro);
    console.log('🌐 URL da requisição:', `${BASE_URL}/pesquisar`);

    try {
      const response = await api.post<RetornoApi<PaginaResultado<Autor>>>(
        `${BASE_URL}/pesquisar`,
        filtro
      );

      console.log('✅ Resposta recebida:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('❌ Erro na resposta da API:', response.data.message);
        throw new Error(response.data.message || 'Erro na pesquisa de autores');
      }
    } catch (error) {
      console.error('❌ Erro na requisição de pesquisa:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido na pesquisa de autores');
      }
    }
  },

  /**
   * Buscar autor por ID
   */
  async buscarPorId(id: number): Promise<Autor> {
    console.log('🔍 Buscando autor por ID:', id);
    
    try {
      const response = await api.get<RetornoApi<Autor>>(`${BASE_URL}/${id}`);
      console.log('✅ Resposta da busca:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar autor');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar autor:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao buscar autor');
      }
    }
  },

  /**
   * Criar novo autor
   */
  async criar(autor: AutorRequest): Promise<Autor> {
    console.log('➕ Criando novo autor:', autor);
    
    try {
      const response = await api.post<RetornoApi<AutorResponse>>(
        BASE_URL,
        autor
      );
      console.log('✅ Resposta da criação:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar autor');
      }
    } catch (error) {
      console.error('❌ Erro ao criar autor:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao criar autor');
      }
    }
  },

  /**
   * Atualizar autor existente
   */
  async atualizar(id: number, autor: AutorRequest): Promise<Autor> {
    console.log('✏️ Atualizando autor ID:', id, 'com dados:', autor);
    
    try {
      const response = await api.put<RetornoApi<AutorResponse>>(
        `${BASE_URL}/${id}`,
        autor
      );
      console.log('✅ Resposta da atualização:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar autor');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar autor:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao atualizar autor');
      }
    }
  },

  /**
   * Excluir autor
   */
  async excluir(id: number): Promise<void> {
    console.log('🗑️ Iniciando exclusão do autor ID:', id);
    
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
        throw new Error(response.data.message || 'Erro ao excluir autor');
      }
      
      // Se chegou até aqui, considerar como sucesso
      console.log('✅ Exclusão confirmada como bem-sucedida');
      
    } catch (error) {
      console.error('❌ Erro na exclusão do autor:', error);
      
      // Se for um erro HTTP com mensagem customizada, preservar a mensagem
      if (error instanceof Error) {
        throw error; // Re-throw para manter a mensagem original
      } else {
        throw new Error('Erro desconhecido ao excluir autor');
      }
    }
  },

  /**
   * Listar todos os autores (para selects)
   */
  async listarTodos(): Promise<Autor[]> {
    const filtro: AutorFiltro = {
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
