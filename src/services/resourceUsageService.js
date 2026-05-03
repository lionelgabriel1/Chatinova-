import { supabase } from './supabase';

export const resourceUsageService = {
  async getResourceUsage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [msgRes, planosRes, instRes, clientesRes] = await Promise.all([
      // Mensagens de hoje
      supabase.from('mensagens').select('*', { count: 'exact', head: true }).gt('created_at', today.toISOString()),
      // Limites dos planos (soma)
      supabase.from('planos').select('limite_mensagens'),
      // Instâncias conectadas
      supabase.from('instancias').select('*', { count: 'exact', head: true }).eq('conectado', true),
      // Clientes ativos e suspensos
      supabase.from('clientes').select('status')
    ]);

    const mensagensHoje = msgRes.count || 0;
    const limiteMensagens = planosRes.data?.reduce((acc, p) => acc + (p.limite_mensagens || 0), 0) || 0;
    const instanciasConectadas = instRes.count || 0;
    
    const clientesAtivos = clientesRes.data?.filter(c => c.status === 'ativo').length || 0;
    const clientesSuspensos = clientesRes.data?.filter(c => c.status === 'suspenso').length || 0;

    const cargaSistema = limiteMensagens > 0 
      ? Math.min(100, Math.round((mensagensHoje / limiteMensagens) * 100))
      : 0;

    return {
      mensagensHoje,
      limiteMensagens,
      instanciasConectadas,
      clientesAtivos,
      clientesSuspensos,
      cargaSistema
    };
  }
};
