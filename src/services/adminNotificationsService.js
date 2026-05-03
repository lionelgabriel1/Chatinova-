import { supabase } from './supabase';

export const adminNotificationsService = {
  async getRecentNotifications(limit = 10) {
    const { data, error } = await supabase
      .from('notificacoes_admin')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getUnreadNotificationsCount() {
    const { count, error } = await supabase
      .from('notificacoes_admin')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false);
    
    if (error) throw error;
    return count || 0;
  },

  async markNotificationAsRead(id) {
    const { error } = await supabase
      .from('notificacoes_admin')
      .update({ lida: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  async markAllNotificationsAsRead() {
    const { error } = await supabase
      .from('notificacoes_admin')
      .update({ lida: true })
      .eq('lida', false);
    
    if (error) throw error;
  },

  async createAdminNotification(data) {
    const { error } = await supabase
      .from('notificacoes_admin')
      .insert([data]);
    
    if (error) throw error;
  },

  subscribeAdminNotifications(callback) {
    return supabase
      .channel('notificacoes_admin_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notificacoes_admin' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};
