import { supabase } from './supabase';

export const clientWhatsappService = {
  async getMinhaInstancia(clienteId) {
    const { data, error } = await supabase
      .from('instancias')
      .select('*')
      .eq('cliente_id', clienteId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getStatus(clienteId) {
    // Simulação ou chamada ao backend proxy
    return { status: 'open', connected: true };
  }
};

export const clientAiMemoryService = {
  async getMinhaMemoria(clienteId) {
    const { data, error } = await supabase
      .from('ai_memorias')
      .select('*')
      .eq('cliente_id', clienteId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async salvarMemoria(clienteId, payload) {
    const { data, error } = await supabase
      .from('ai_memorias')
      .upsert({ ...payload, cliente_id: clienteId }, { onConflict: 'cliente_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const clientNotificationsService = {
  async getAll(clienteId) {
    const { data, error } = await supabase
      .from('notificacoes_clientes')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async markAsRead(id) {
    await supabase.from('notificacoes_clientes').update({ lida: true }).eq('id', id);
  }
};

export const clientAvisosService = {
  async getAll(clienteId) {
    const { data, error } = await supabase
      .from('avisos_clientes')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

export const clientSettingsService = {
  async getSettings(clienteId) {
    const { data, error } = await supabase
      .from('configuracoes_cliente')
      .select('*')
      .eq('cliente_id', clienteId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async saveSettings(clienteId, payload) {
    const { data, error } = await supabase
      .from('configuracoes_cliente')
      .upsert({ ...payload, cliente_id: clienteId }, { onConflict: 'cliente_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
