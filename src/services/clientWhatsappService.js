import axios from 'axios';

const API_URL = '';

const getClientHeaders = () => {
  const session = localStorage.getItem('cliente_token');
  if (!session) return {};
  const client = JSON.parse(session);
  return {
    'x-client-id': client.id
  };
};

export const clientWhatsappService = {
  /**
   * Cria ou recupera instância e busca QR Code
   */
  async createWhatsappInstance() {
    try {
      const response = await axios.post(`${API_URL}/api/client/whatsapp/create`, {}, {
        headers: getClientHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Busca status da conexão
   */
  async getWhatsappStatus() {
    try {
      const response = await axios.get(`${API_URL}/api/client/whatsapp/status`, {
        headers: getClientHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Busca um novo QR Code
   */
  async getWhatsappQRCode() {
    try {
      const response = await axios.get(`${API_URL}/api/client/whatsapp/qrcode`, {
        headers: getClientHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Desconecta o WhatsApp
   */
  async disconnectWhatsapp() {
    try {
      const response = await axios.post(`${API_URL}/api/client/whatsapp/disconnect`, {}, {
        headers: getClientHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reinicia a instância (Deleta tudo e começa do zero)
   */
  async resetWhatsapp() {
    try {
      const response = await axios.delete(`${API_URL}/api/client/whatsapp/reset`, {
        headers: getClientHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
