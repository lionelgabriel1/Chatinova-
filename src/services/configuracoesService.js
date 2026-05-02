import api from './api';

export const configuracoesService = {
  /**
   * Obter todas as configurações do sistema
   */
  async getAll() {
    try {
      const response = await api.get('/api/admin/config');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter configurações');
      }

      return response.data.config;
    } catch (error) {
      console.error('Erro ao obter configurações:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Atualizar uma configuração
   */
  async update(chave, valor) {
    try {
      const response = await api.put(`/api/admin/config/${chave}`, {
        valor
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar configuração');
      }

      return response.data.config;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Obter planos (pode ser adicionado ao backend depois)
   */
  async getPlanos() {
    try {
      // Por enquanto, retorna planos hardcoded
      // Implementar endpoint no backend se necessário
      return [
        {
          id: 1,
          nome: 'Trial 24h',
          preco: 0,
          limite_instancias: 1,
          limite_mensagens: 200
        },
        {
          id: 2,
          nome: 'Starter',
          preco: 4999,
          limite_instancias: 1,
          limite_mensagens: 1000
        },
        {
          id: 3,
          nome: 'Pro',
          preco: 10999,
          limite_instancias: 3,
          limite_mensagens: 5000
        },
        {
          id: 4,
          nome: 'Business',
          preco: 24999,
          limite_instancias: 10,
          limite_mensagens: -1 // Unlimited
        }
      ];
    } catch (error) {
      console.error('Erro ao obter planos:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Testar conexão com Evolution API
   */
  async testEvolutionAPI() {
    try {
      const response = await api.post('/api/admin/config/test/evolution');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao conectar com Evolution');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao testar Evolution:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Testar conexão com Groq API
   */
  async testGroqAPI() {
    try {
      const response = await api.post('/api/admin/config/test/groq');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao conectar com Groq');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao testar Groq:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Ativar/desativar modo manutenção
   */
  async setMaintenanceMode(ativo, mensagem = 'Sistema em manutenção') {
    try {
      const response = await api.post('/api/admin/config/maintenance', {
        ativo,
        mensagem
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar modo manutenção');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar modo manutenção:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
