import api from './api';

export const adminsService = {
  /**
   * Listar todos os clientes (admin)
   */
  async listClients(status = null, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', limit);
      params.append('offset', offset);

      const response = await api.get(`/api/admin/clients?${params.toString()}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao listar clientes');
      }

      return response.data.clientes || [];
    } catch (error) {
      console.error('Erro ao listar clientes:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Obter detalhes de um cliente
   */
  async getClient(clientId) {
    try {
      const response = await api.get(`/api/admin/clients/${clientId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao obter cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Atualizar cliente
   */
  async updateClient(clientId, clientData) {
    try {
      const response = await api.put(`/api/admin/clients/${clientId}`, {
        nome: clientData.nome,
        email: clientData.email,
        telefone: clientData.telefone,
        plano_id: clientData.plano_id,
        limite_instancias: clientData.limite_instancias,
        limite_mensagens: clientData.limite_mensagens
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Aprovar cliente pendente
   */
  async approveClient(clientId, planoId, diasValidade = 30) {
    try {
      const response = await api.post(`/api/admin/clients/${clientId}/approve`, {
        plano_id: planoId,
        dias_validade: diasValidade
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao aprovar cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao aprovar cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Rejeitar cliente pendente
   */
  async rejectClient(clientId, motivo = 'Rejeitado pelo administrador') {
    try {
      const response = await api.post(`/api/admin/clients/${clientId}/reject`, {
        motivo
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao rejeitar cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao rejeitar cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Bloquear cliente
   */
  async blockClient(clientId, motivo = 'Bloqueado pelo administrador') {
    try {
      const response = await api.post(`/api/admin/clients/${clientId}/block`, {
        motivo
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao bloquear cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao bloquear cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Desbloquear cliente
   */
  async unblockClient(clientId) {
    try {
      const response = await api.post(`/api/admin/clients/${clientId}/unblock`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao desbloquear cliente');
      }

      return response.data.cliente;
    } catch (error) {
      console.error('Erro ao desbloquear cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Verificar se é super admin (removido - não é mais necessário)
   */
  async isSuperAdmin() {
    return true; // Implementar verificação no backend se necessário
  }
};
