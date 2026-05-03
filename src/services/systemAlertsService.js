import { supabase } from './supabase';

export const systemAlertsService = {
  async getActiveAlerts() {
    const { data, error } = await supabase
      .from('alertas_sistema')
      .select('*')
      .eq('resolvido', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCriticalAlertsCount() {
    const { count, error } = await supabase
      .from('alertas_sistema')
      .select('*', { count: 'exact', head: true })
      .eq('resolvido', false)
      .eq('nivel', 'critical');
    
    if (error) throw error;
    return count || 0;
  },

  async resolveAlert(id) {
    const { error } = await supabase
      .from('alertas_sistema')
      .update({ resolvido: true, resolved_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async createAlert(data) {
    const { error } = await supabase
      .from('alertas_sistema')
      .insert([data]);
    
    if (error) throw error;
  },

  subscribeAlerts(callback) {
    return supabase
      .channel('alertas_sistema_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alertas_sistema' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};
