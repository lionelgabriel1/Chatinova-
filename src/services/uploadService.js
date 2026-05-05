import api from './api';

export const uploadService = {
  async uploadChatFile(file, clienteId) {
    try {
      if (!file) throw new Error('Nenhum arquivo selecionado.');
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de 10MB.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('cliente_id', clienteId);

      const response = await api.post('/api/upload/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error(error.response?.data?.error || error.message || 'Falha ao enviar arquivo.');
    }
  }
};
