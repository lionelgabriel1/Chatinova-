import api from './api';

export const clientInstanceService = {
  /**
   * Busca instâncias do cliente autenticado
   */
  async getMyInstances() {
    try {
      const response = await api.get('/api/client/instances');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao listar instâncias');
      }

      return response.data.instances || [];
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Busca perfil do cliente com limites
   */
  async getMyProfile() {
    try {
      const response = await api.get('/api/client/dashboard');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao carregar dashboard');
      }

      const { cliente, plano, uso } = response.data.dashboard;
      
      return {
        id: cliente.id,
        email: cliente.email,
        nome: cliente.nome,
        limite_instancias: uso.limite_instancias,
        limite_mensagens: uso.limite_mensagens,
        mensagens_usadas: uso.mensagens_usadas,
        plano: plano,
        status: cliente.status
      };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Cria nova instância WhatsApp
   */
  async createInstance(nomeAmigavel) {
    try {
      const response = await api.post('/api/client/instances', {
        nome_amigavel: nomeAmigavel
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao criar instância');
      }

      return response.data.instance;
    } catch (error) {
      console.error('Erro ao criar instância:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Busca QR Code para conectar WhatsApp
   */
  async getQRCode(instanceId) {
    try {
      const response = await api.get(`/api/client/instances/${instanceId}/qrcode`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter QR Code');
      }

      return {
        base64: response.data.qrcode,
        code: response.data.code
      };
    } catch (error) {
      console.error('Erro ao obter QR Code:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Obter status de conexão
   */
  async getStatus(instanceId) {
    try {
      const response = await api.get(`/api/client/instances/${instanceId}/status`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter status');
      }

      return response.data.connected || false;
    } catch (error) {
      console.error('Erro ao obter status:', error.message);
      return false;
    }
  },

  /**
   * Desconectar instância WhatsApp
   */
  async logoutInstance(instanceId) {
    try {
      const response = await api.post(`/api/client/instances/${instanceId}/logout`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao desconectar');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao desconectar:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Deletar instância
   */
  async deleteInstance(instanceId) {
    try {
      const response = await api.delete(`/api/client/instances/${instanceId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao deletar instância');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao deletar instância:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
