import { supabase } from './supabase';

export const logService = {
  /**
   * Registra um log no sistema
   * @param {string} nivel - success, error, warning, info
   * @param {string} titulo - Título curto da ação
   * @param {string} descricao - Detalhes da ação
   * @param {object} metadata - Dados extras
   */
  async log(nivel, titulo, descricao = '', metadata = {}) {
    try {
      const { error } = await supabase
        .from('logs_sistema')
        .insert([{ 
          nivel, 
          titulo, 
          descricao: descricao || titulo, // Fallback se não houver descrição
          metadata 
        }]);
      
      if (error) console.error('Falha ao registrar log no banco:', error);
    } catch (e) {
      console.error('Erro crítico no serviço de logs:', e);
    }
  },

  info: (titulo, desc, meta) => logService.log('info', titulo, desc, meta),
  success: (titulo, desc, meta) => logService.log('success', titulo, desc, meta),
  warning: (titulo, desc, meta) => logService.log('warning', titulo, desc, meta),
  error: (titulo, desc, meta) => logService.log('error', titulo, desc, meta),
};
