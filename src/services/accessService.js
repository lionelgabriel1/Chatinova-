import { supabase } from './supabase';

export const accessService = {
  /**
   * Registra ou atualiza presença do usuário
   */
  async updatePresence(userData) {
    try {
      const { usuario_id, usuario_tipo, nome, email, rota_atual, aba_atual, ip, user_agent } = userData;

      const payload = {
        usuario_id,
        usuario_tipo,
        nome,
        email,
        rota_atual,
        aba_atual,
        ip,
        user_agent,
        online: true,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('presenca_usuarios')
        .upsert(payload, { onConflict: 'usuario_id' });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      return null;
    }
  },

  /**
   * Registra um acesso a uma página específica
   */
  async registerAccess(accessData) {
    try {
      const { error } = await supabase
        .from('acessos_site')
        .insert([accessData]);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao registrar acesso:', error);
    }
  },

  /**
   * Marca usuário como offline
   */
  async markOffline(usuario_id) {
    try {
      await supabase
        .from('presenca_usuarios')
        .update({ online: false, updated_at: new Date().toISOString() })
        .eq('usuario_id', usuario_id);
    } catch (error) {
      console.error('Erro ao marcar offline:', error);
    }
  },

  /**
   * Busca usuários online agora
   */
  async getOnlineUsers() {
    try {
      // Consideramos online se marcou como online E foi visto nos últimos 2 minutos
      const threshold = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('presenca_usuarios')
        .select('*')
        .eq('online', true)
        .gte('last_seen', threshold)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários online:', error);
      return [];
    }
  },

  /**
   * Busca métricas de acessos
   */
  async getAccessMetrics() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { data: hojeAcessos } = await supabase.from('acessos_site').select('id', { count: 'exact', head: true }).gte('created_at', hoje.toISOString());
    const { data: semanaAcessos } = await supabase.from('acessos_site').select('id', { count: 'exact', head: true }).gte('created_at', seteDiasAtras.toISOString());
    const threshold = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: totalOnline } = await supabase.from('presenca_usuarios').select('id', { count: 'exact', head: true }).eq('online', true).gte('last_seen', threshold);

    return {
      hojeAcessos: hojeAcessos || 0,
      semanaAcessos: semanaAcessos || 0,
      totalOnline: totalOnline || 0
    };
  },

  /**
   * Busca usuários online e enriquece com dados de clientes, planos e mensagens
   */
  async getEnrichedOnlineUsers() {
    try {
      const onlineUsers = await this.getOnlineUsers();
      if (!onlineUsers || onlineUsers.length === 0) return [];

      // Separar IDs de clientes para busca em lote
      const clienteIds = onlineUsers
        .filter(u => u.usuario_tipo === 'cliente')
        .map(u => u.usuario_id);

      if (clienteIds.length === 0) return onlineUsers;

      // Buscar dados extras dos clientes
      const { data: clientesData } = await supabase
        .from('clientes')
        .select(`
          id,
          status,
          plano_vencimento,
          planos (nome)
        `)
        .in('id', clienteIds);

      // Buscar contagem de mensagens
      const { data: msgsData } = await supabase
        .from('mensagens')
        .select('cliente_id, origem')
        .in('cliente_id', clienteIds);

      const { data: chatData } = await supabase
        .from('mensagens_chat')
        .select('cliente_id')
        .in('cliente_id', clienteIds);

      return onlineUsers.map(user => {
        if (user.usuario_tipo === 'admin') return user;

        const extra = clientesData?.find(c => c.id === user.usuario_id);
        const userMsgs = msgsData?.filter(m => m.cliente_id === user.usuario_id) || [];
        const userChat = chatData?.filter(m => m.cliente_id === user.usuario_id) || [];

        const diasRestantes = extra?.plano_vencimento 
          ? Math.ceil((new Date(extra.plano_vencimento) - new Date()) / (1000 * 60 * 60 * 24))
          : 0;

        return {
          ...user,
          status: extra?.status || 'desconhecido',
          plano: extra?.planos?.nome || 'Nenhum',
          vencimento: extra?.plano_vencimento,
          dias_restantes: diasRestantes,
          msgs_recebidas: userMsgs.filter(m => m.origem === 'usuario').length,
          msgs_ia: userMsgs.filter(m => m.origem === 'ia').length,
          msgs_suporte: userChat.length
        };
      });
    } catch (error) {
      console.error('Erro getEnrichedOnlineUsers:', error);
      return [];
    }
  },

  /**
   * Subscribe para presença em tempo real
   */
  subscribePresence(callback) {
    const channelId = `presence_realtime_${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presenca_usuarios' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};
