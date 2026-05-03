import { supabase } from './supabase';

export const configService = {
  async getAll() {
    const { data, error } = await supabase.from('configuracoes_sistema').select('*');
    if (error) throw error;
    return data.reduce((acc, curr) => {
      acc[curr.chave] = curr.valor;
      return acc;
    }, {});
  },

  async getConfig(chave) {
    const { data, error } = await supabase.rpc('get_config', { p_chave: chave });
    if (error) throw error;
    return data;
  },

  async setConfig(chave, valor) {
    const { error } = await supabase.rpc('set_config', { p_chave: chave, p_valor: valor });
    if (error) throw error;
    return true;
  },

  // Planos CRUD
  async getPlanos() {
    const { data, error } = await supabase.from('planos').select('*').order('preco', { ascending: true });
    if (error) throw error;
    return data;
  },

  async savePlano(plano) {
    const { data, error } = await supabase.from('planos').upsert(plano).select().single();
    if (error) throw error;
    return data;
  },

  async deletePlano(id) {
    const { error } = await supabase.from('planos').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
