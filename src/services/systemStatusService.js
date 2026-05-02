import { supabase } from './supabase';

export const systemStatusService = {
  /**
   * Busca o status de um serviço específico
   */
  async getSystemStatus(serviceName) {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .eq('service_name', serviceName)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  /**
   * Cria um registro de status inicial
   */
  async createSystemStatus(serviceName) {
    const { data, error } = await supabase
      .from('system_status')
      .insert([{ 
        service_name: serviceName, 
        started_at: new Date().toISOString(),
        status: 'online' 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Busca ou cria o status caso não exista
   */
  async getOrCreateSystemStatus(serviceName) {
    let data = await this.getSystemStatus(serviceName);
    
    if (!data) {
      data = await this.createSystemStatus(serviceName);
    }
    
    return data;
  },

  /**
   * Atualiza o status do serviço
   */
  async updateSystemStatus(serviceName, status) {
    const { data, error } = await supabase
      .from('system_status')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('service_name', serviceName)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Reseta o tempo de atividade (reinicia o started_at)
   */
  async resetUptime(serviceName) {
    const { data, error } = await supabase
      .from('system_status')
      .update({ 
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('service_name', serviceName)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
