import { supabase } from './supabase';

export const mensagensService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('mensagens')
      .select('*, clientes(nome), instancias(nome_instancia)')
      .order('created_at', { ascending: false });

    if (filters.origem) query = query.eq('origem', filters.origem);
    if (filters.search) query = query.ilike('conteudo', `%${filters.search}%`);

    const { data, error } = await query.limit(50);
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { count: total } = await supabase.from('mensagens').select('*', { count: 'exact', head: true });
    const { count: ia } = await supabase.from('mensagens').select('*', { count: 'exact', head: true }).eq('origem', 'ia');
    const { count: user } = await supabase.from('mensagens').select('*', { count: 'exact', head: true }).eq('origem', 'usuario');
    
    return {
      total: total || 0,
      ia: ia || 0,
      user: user || 0
    };
  }
};
