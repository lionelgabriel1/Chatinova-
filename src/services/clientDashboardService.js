import api from './api';

export const clientDashboardService = {
  /**
   * Obter métricas do dashboard
   */
  async getMetrics(clienteId) {
    try {
      const response = await api.get('/api/client/dashboard');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao carregar dashboard');
      }

      const { cliente, plano, uso, instancias } = response.data.dashboard;

      return {
        cliente,
        plano: {
          nome: plano?.nome || 'Sem plano',
          vencimento: plano?.data_vencimento,
          status: cliente.status || 'ativo'
        },
        whatsapp: {
          conectado: instancias.conectadas > 0,
          total: instancias.total
        },
        mensagens: {
          hoje: 0, // Implementar se necessário
          mes: uso.mensagens_ultimos_30_dias
        },
        notificacoes: 0 // Implementar se necessário
      };
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Obter dados para gráficos
   */
  async getChartData(clienteId) {
    try {
      const response = await api.get('/api/client/dashboard');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao carregar dados');
      }

      const { uso } = response.data.dashboard;

      return {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
        datasets: [
          {
            label: 'Mensagens IA',
            data: [uso.mensagens_ultimos_30_dias / 7, 0, 0, 0, 0, 0, 0]
          },
          {
            label: 'Atendimento Humano',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ]
      };
    } catch (error) {
      console.error('Erro ao buscar dados de gráficos:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Obter perfil do cliente
   */
  async getProfile() {
    try {
      const response = await api.get('/api/client/profile');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter perfil');
      }

      return response.data.profile;
    } catch (error) {
      console.error('Erro ao obter perfil:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Atualizar perfil do cliente
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/client/profile', {
        nome: profileData.nome,
        sobrenome: profileData.sobrenome,
        telefone: profileData.telefone
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar perfil');
      }

      return response.data.profile;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
