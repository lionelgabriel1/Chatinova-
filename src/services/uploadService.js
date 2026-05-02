import { supabase } from './supabase';

export const uploadService = {
  /**
   * Faz upload de um arquivo para o bucket chat_arquivos
   * @param {File} file - O arquivo a ser enviado
   * @param {string} clienteId - ID do cliente para organizar pastas
   */
  async uploadChatFile(file, clienteId) {
    try {
      if (!file) throw new Error('Nenhum arquivo selecionado.');
      
      // Limite de 10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de 10MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${clienteId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('chat_arquivos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('chat_arquivos')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        nome: file.name,
        tipo: file.type.startsWith('image/') ? 'imagem' : 'arquivo'
      };
    } catch (error) {
      console.error('Erro no uploadChatFile:', error);
      throw error;
    }
  }
};
