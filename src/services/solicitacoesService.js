import { supabase } from './supabase';

export const solicitacoesService = {
  async getPendingClients() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .in('status', ['pending', 'pendente'])
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async approveClient(clienteId, planoId, dias) {
    const dataAprovacao = new Date().toISOString();
    const dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + parseInt(dias));

    const { data: plano } = await supabase
      .from('planos')
      .select('nome')
      .eq('id', planoId)
      .single();

    const { data, error } = await supabase
      .from('clientes')
      .update({
        status: 'ativo',
        plano_id: planoId,
        plano_nome: plano?.nome || 'Plano Personalizado',
        data_aprovacao: dataAprovacao,
        data_vencimento: dataVencimento.toISOString(),
        dias_restantes: parseInt(dias)
      })
      .eq('id', clienteId);

    if (error) throw error;

    // Criar log
    await supabase.from('logs_sistema').insert([{
      tipo: 'workflow',
      nivel: 'info',
      titulo: 'Cliente Aprovado',
      descricao: `Cliente ${clienteId} aprovado pelo admin`,
      usuario_tipo: 'admin'
    }]);

    return data;
  },

  async rejectClient(clienteId) {
    const { data, error } = await supabase.functions.invoke('admin-manager', {
      body: { 
        action: 'reject_client', 
        payload: { id: clienteId } 
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    // Criar log
    await supabase.from('logs_sistema').insert([{
      tipo: 'workflow',
      nivel: 'warning',
      titulo: 'Cliente Reprovado',
      descricao: `Cliente ${clienteId} reprovado e removido`,
      usuario_tipo: 'admin'
    }]);

    return data;
  },

  async getSolicitacoesMetrics() {
    const { data: pending } = await supabase
      .from('clientes')
      .select('id', { count: 'exact' })
      .in('status', ['pending', 'pendente']);

    const today = new Date().toISOString().split('T')[0];
    
    const { data: approvedToday } = await supabase
      .from('clientes')
      .select('id', { count: 'exact' })
      .eq('status', 'ativo')
      .gte('data_aprovacao', today);

    return {
      totalPendentes: pending?.length || 0,
      aprovadosHoje: approvedToday?.length || 0,
      reprovadosHoje: 0 // Precisaria de uma tabela de histórico para ser exato
    };
  }
};
