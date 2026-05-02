import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL || 'https://inovachat.inovapro.cloud/api/admin';

const api = axios.create({
  baseURL: API_URL
});

export const adminService = {
  /**
   * Sincroniza instâncias da Evolution com o Banco
   */
  async syncInstances() {
    const response = await api.get('/whatsapp/instances');
    return response.data;
  },

  /**
   * Busca o status real de uma instância
   */
  async getInstanceStatus(instanceName) {
    const response = await api.get(`/whatsapp/status/${instanceName}`);
    return response.data;
  },

  /**
   * Testa o envio de mensagem via WhatsApp
   */
  async testWhatsapp(instanceName, number) {
    const response = await api.post('/whatsapp/test', { instanceName, number });
    return response.data;
  },

  /**
   * Testa a conexão com a Groq AI
   */
  async testGroq() {
    const response = await api.post('/groq/test');
    return response.data;
  }
};
