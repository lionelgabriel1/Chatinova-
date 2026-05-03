import { supabase } from './supabase';

export const logsService = {
  /**
   * Cria um log genérico no sistema
   */
  async createLog({ tipo, nivel = 'info', titulo, descricao, usuario_tipo, usuario_id, usuario_nome, usuario_email, rota, aba, metadata = {} }) {
    try {
      const { data, error } = await supabase
        .from('logs_sistema')
        .insert([{
          tipo,
          nivel,
          titulo,
          descricao,
          usuario_tipo,
          usuario_id,
          usuario_nome,
          usuario_email,
          rota,
          aba,
          metadata,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      return null;
    }
  },

  /**
   * Busca logs com filtros
   */
  async getLogs(filters = {}) {
    try {
      let query = supabase
        .from('logs_sistema')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.tipo) query = query.eq('tipo', filters.tipo);
      if (filters.nivel) query = query.eq('nivel', filters.nivel);
      if (filters.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return [];
    }
  },

  /**
   * Subscribe para novos logs
   */
  subscribeLogs(callback) {
    const channelId = `logs_realtime_${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs_sistema' }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  },

  /**
   * Métricas rápidas para o dashboard de logs
   */
  async getLogsMetrics() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data: totalHoje } = await supabase.from('logs_sistema').select('id', { count: 'exact', head: true }).gte('created_at', hoje.toISOString());
    const { data: errosHoje } = await supabase.from('logs_sistema').select('id', { count: 'exact', head: true }).eq('nivel', 'error').gte('created_at', hoje.toISOString());
    const { data: loginsHoje } = await supabase.from('logs_sistema').select('id', { count: 'exact', head: true }).eq('tipo', 'login').gte('created_at', hoje.toISOString());
    const { data: msgsHoje } = await supabase.from('logs_sistema').select('id', { count: 'exact', head: true }).eq('tipo', 'mensagem').gte('created_at', hoje.toISOString());

    return {
      totalHoje: totalHoje || 0,
      errosHoje: errosHoje || 0,
      loginsHoje: loginsHoje || 0,
      msgsHoje: msgsHoje || 0
    };
  }
};
