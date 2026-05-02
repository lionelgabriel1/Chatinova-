import { supabase } from './supabase';

export const notificationService = {
  /**
   * Busca a contagem de mensagens não lidas de clientes
   */
  async getUnreadMessagesCount() {
    try {
      const { count, error } = await supabase
        .from('mensagens_chat')
        .select('*', { count: 'exact', head: true })
        .eq('remetente_tipo', 'cliente')
        .eq('lida', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro getUnreadMessagesCount:', error);
      return 0;
    }
  },

  /**
   * Busca a contagem de solicitações pendentes
   */
  async getPendingRequestsCount() {
    try {
      const { count, error } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'pendente']);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro getPendingRequestsCount:', error);
      return 0;
    }
  },

  /**
   * Busca a contagem de bugs abertos
   */
  async getOpenBugsCount() {
    try {
      const { count, error } = await supabase
        .from('bug_reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberto');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro getOpenBugsCount:', error);
      return 0;
    }
  },

  /**
   * Marca as mensagens de um cliente específico como lidas (pelo admin)
   */
  async markMessagesAsRead(clienteId) {
    try {
      const { error } = await supabase
        .from('mensagens_chat')
        .update({ lida: true })
        .eq('cliente_id', clienteId)
        .eq('remetente_tipo', 'cliente')
        .eq('lida', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro markMessagesAsRead:', error);
      return false;
    }
  },

  /**
   * Escuta novas mensagens e novas solicitações em tempo real
   */
  subscribeAll(onNotification) {
    const channelName = `admin_global_notifications_${Math.random().toString(36).substring(7)}`;
    
    return supabase
      .channel(channelName)
      // Escutar Novas Mensagens
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens_chat'
        },
        async (payload) => {
          if (payload.new.remetente_tipo === 'cliente') {
            const { data: cliente } = await supabase
              .from('clientes')
              .select('nome, sobrenome')
              .eq('id', payload.new.cliente_id)
              .single();
            
            onNotification({
              type: 'new_message',
              data: {
                ...payload.new,
                cliente_nome: cliente ? `${cliente.nome} ${cliente.sobrenome || ''}`.trim() : 'Cliente Desconhecido'
              }
            });
          }
        }
      )
      // Escutar Atualização de Mensagens (Lidas)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mensagens_chat',
          filter: 'lida=eq.true'
        },
        () => {
          onNotification({ type: 'update_message_count' });
        }
      )
      // Escutar Novas Solicitações de Cadastro
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clientes'
        },
        (payload) => {
          if (['pending', 'pendente'].includes(payload.new.status)) {
            onNotification({
              type: 'new_request',
              data: payload.new
            });
          }
        }
      )
      // Escutar Atualização de Solicitações (Aprovadas/Reprovadas)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clientes'
        },
        () => {
          onNotification({ type: 'update_request_count' });
        }
      )
      // Escutar Novos Bugs
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bug_reports'
        },
        (payload) => {
          onNotification({
            type: 'new_bug',
            data: payload.new
          });
        }
      )
      // Escutar Atualização de Bugs (Status alterado)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bug_reports'
        },
        () => {
          onNotification({ type: 'update_bug_count' });
        }
      )
      .subscribe();
  },

  /**
   * @deprecated Use subscribeAll
   */
  subscribeNewMessages(onNewMessage) {
    return this.subscribeAll((notif) => {
      if (notif.type === 'new_message') {
        onNewMessage(notif.data);
      } else if (notif.type === 'update_message_count') {
        onNewMessage({ type: 'update_count' });
      }
    });
  }
};
