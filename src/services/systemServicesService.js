import { supabase } from './supabase';

export const systemServicesService = {
  async getSystemServices() {
    const { data, error } = await supabase
      .from('system_services')
      .select('*')
      .order('service_name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateServiceStatus(serviceName, status, latency_ms, metadata = {}) {
    const { data, error } = await supabase
      .from('system_services')
      .update({ status, latency_ms, metadata, last_checked: new Date().toISOString() })
      .eq('service_name', serviceName)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  subscribeSystemServices(callback) {
    return supabase
      .channel('system_services_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_services' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};
