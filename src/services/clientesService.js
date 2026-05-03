import { supabase } from './supabase';

export const clientesService = {
  async getAll() {
    try {
      // Simplificando a query para diagnosticar o erro
      // Removemos o join com planos temporariamente para ver se o erro persiste
      const { data, error } = await supabase
        .from('clientes')
        .select('*') 
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase Error [clientesService.getAll]:', error);
        throw error;
      }

      // Adicionamos os dados do plano manualmente se necessário, 
      // ou apenas retornamos os clientes para ver se a tabela carrega.
      return data || [];
    } catch (error) {
      console.error('Catch Error [clientesService.getAll]:', error);
      throw error;
    }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, planos(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(clienteData) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([clienteData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, clienteData) {
    const { data, error } = await supabase
      .from('clientes')
      .update(clienteData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async aprovarCliente(id, plano_id, dias) {
    const data_aprovacao = new Date();
    const data_vencimento = new Date();
    data_vencimento.setDate(data_vencimento.getDate() + parseInt(dias));

    const { data: plano } = await supabase
      .from('planos')
      .select('nome')
      .eq('id', plano_id)
      .single();

    const { data, error } = await supabase
      .from('clientes')
      .update({ 
        status: 'ativo',
        plano_id,
        plano_nome: plano?.nome || 'Pro',
        data_aprovacao: data_aprovacao.toISOString(),
        data_vencimento: data_vencimento.toISOString(),
        dias_restantes: parseInt(dias)
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async reprovarCliente(id) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async setStatus(id, status) {
    const { data, error } = await supabase
      .from('clientes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async checkExpiredPlans() {
    const now = new Date().toISOString();
    
    const { data: expiredClients, error } = await supabase
      .from('clientes')
      .select('id')
      .eq('status', 'ativo')
      .lt('data_vencimento', now);

    if (error) return;

    if (expiredClients && expiredClients.length > 0) {
      const ids = expiredClients.map(c => c.id);
      await supabase
        .from('clientes')
        .update({ status: 'suspenso' })
        .in('id', ids);
      
      console.log(`${ids.length} clientes suspensos por vencimento.`);
    }
  }
};
