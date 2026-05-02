import { supabase } from './supabase';

export const notificacoesService = {
  async getByCliente(clienteId) {
    const { data, error } = await supabase
      .from('notificacoes_clientes')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markAsRead(id) {
    const { error } = await supabase
      .from('notificacoes_clientes')
      .update({ lida: true })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
