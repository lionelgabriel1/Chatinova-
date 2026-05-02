import api from './api';

export const clientAiMemoryService = {
  /**
   * Obter configuração de IA de uma instância
   */
  async getMyMemory(instanceId) {
    try {
      const response = await api.get(`/api/client/ai-memory/${instanceId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao obter configuração de IA');
      }

      return response.data.aiMemory;
    } catch (error) {
      console.error('Erro ao obter AI Memory:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Atualizar configuração de IA
   */
  async saveMemory(instanceId, aiMemoryData) {
    try {
      const response = await api.put(`/api/client/ai-memory/${instanceId}`, {
        persona: aiMemoryData.persona,
        nicho: aiMemoryData.nicho,
        tom: aiMemoryData.tom,
        instrucoes_customizadas: aiMemoryData.instrucoes_customizadas,
        temperatura: aiMemoryData.temperatura,
        max_tokens: aiMemoryData.max_tokens,
        ativa: aiMemoryData.ativa
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao atualizar configuração');
      }

      return response.data.aiMemory;
    } catch (error) {
      console.error('Erro ao atualizar AI Memory:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  /**
   * Testar IA com um prompt
   */
  async testAI(pergunta, instanceId) {
    try {
      const response = await api.post(`/api/client/ai-memory/${instanceId}/test`, {
        prompt: pergunta
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
