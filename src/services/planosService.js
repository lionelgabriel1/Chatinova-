import { supabase } from './supabase';

export const planosService = {
  async getPlanos() {
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .order('limite_instancias', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getPlanosAtivos() {
    // Como a tabela não tem campo status, retornamos todos por enquanto
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .order('limite_instancias', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updatePlano(id, updates) {
    const { data, error } = await supabase
      .from('planos')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
};
