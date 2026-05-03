import { supabase } from './supabase';

export const noticeService = {
  async getNotices(clienteId) {
    // Busca avisos globais
    const { data: globalNotices, error: globalError } = await supabase
      .from('avisos_clientes')
      .select('*')
      .eq('global', true)
      .order('created_at', { ascending: false });

    if (globalError) throw globalError;

    // Busca avisos específicos para este cliente (se houver essa lógica no futuro)
    // Por enquanto, focamos nos globais e verificamos quais foram lidos
    const { data: readLogs, error: readError } = await supabase
      .from('avisos_lidos')
      .select('aviso_id')
      .eq('cliente_id', clienteId);

    if (readError) throw readError;

    const readIds = new Set(readLogs.map(log => log.aviso_id));

    return globalNotices.map(notice => ({
      ...notice,
      lido: readIds.has(notice.id)
    }));
  },

  async markAsRead(avisoId, clienteId) {
    const { error } = await supabase
      .from('avisos_lidos')
      .upsert({ aviso_id: avisoId, cliente_id: clienteId }, { onConflict: 'aviso_id,cliente_id' });
    
    if (error) throw error;
  },

  async createNotice(noticeData) {
    const { data, error } = await supabase
      .from('avisos_clientes')
      .insert(noticeData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // CORREÇÃO CRÍTICA: Adicionar .on() ANTES de .subscribe()
  subscribeToNewNotices(callback) {
    const channelId = `notices_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId);
    
    channel
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'avisos_clientes',
          filter: 'global=eq.true'
        }, 
        (payload) => callback(payload.new)
      )
      .subscribe();

    return channel;
  }
};

// Alias para manter compatibilidade se necessário
export const avisosService = noticeService;
