import { supabase } from './supabase';

export const instanciasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('instancias')
      .select('*, clientes(nome, email)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    // Usamos o campo status ou conectado. Por enquanto verificamos status 'open' ou conectado true.
    const { data: all } = await supabase.from('instancias').select('*');
    const connected = all?.filter(i => i.status === 'open' || i.conectado === true).length || 0;
    
    return {
      total: all?.length || 0,
      connected: connected,
      disconnected: (all?.length || 0) - connected
    };
  }
};
