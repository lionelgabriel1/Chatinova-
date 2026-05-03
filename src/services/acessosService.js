import { supabase } from './supabase';

export const acessosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('acessos_site')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase
      .from('acessos_site')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', today);
    
    return {
      today: todayCount || 0
    };
  }
};
