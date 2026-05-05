import api from './api';

export const clientAiMemoryService = {
  /**
   * Obter configuração de IA (usa a primeira instância se não especificar)
   */
  async getMyMemory(instanceId) {
    try {
      // Se não especificar instanceId, chama a rota sem ID (pega a primeira instância)
      const url = instanceId 
        ? `/api/client/ai-memory/${instanceId}` 
        : '/api/client/ai-memory';
      
      const response = await api.get(url);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter configuração de IA');
      }

      // A API retorna { success, memory: {...} } na rota sem ID
      return response.data.memory || response.data.aiMemory || {};
    } catch (error) {
      console.error('Erro ao obter AI Memory:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Salvar configuração de IA
   */
  async saveMemory(instanceId, aiMemoryData) {
    try {
      // Se não especificar instanceId, chama a rota sem ID
      const url = instanceId 
        ? `/api/client/ai-memory/${instanceId}` 
        : '/api/client/ai-memory';
      
      // Enviar os campos no formato que a API espera
      const response = await api.put(url, aiMemoryData);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar configuração');
      }

      return response.data.memory || response.data.aiMemory || {};
    } catch (error) {
      console.error('Erro ao atualizar AI Memory:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Testar IA com um prompt
   */
  async testAI(pergunta, instanceId, formData) {
    try {
      const url = instanceId 
        ? `/api/client/ai-memory/${instanceId}/test` 
        : '/api/client/ai-memory/test';
      
      const response = await api.post(url, {
        prompt: pergunta,
        ...(formData || {})
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao testar IA');
      }

      return {
        prompt: response.data.prompt,
        response: response.data.response,
        model: response.data.model
      };
    } catch (error) {
      console.error('Erro ao testar IA:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
