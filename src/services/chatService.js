import { supabase } from './supabase';

export const chatService = {
  async getAdminChatContacts() {
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select(`id, nome, sobrenome, email, status, created_at`)
      .order('created_at', { ascending: false });

    if (clientesError) throw clientesError;

    const { data: conversas, error: conversasError } = await supabase
      .from('conversas')
      .select('*');

    if (conversasError) throw conversasError;

    return (clientes || []).map(cliente => {
      const conversa = (conversas || []).find(c => c.cliente_id === cliente.id);
      return {
        ...cliente,
        conversa_id: conversa?.id || null,
        ultima_mensagem: conversa?.ultima_mensagem || 'Nenhuma mensagem ainda',
        ultima_mensagem_em: conversa?.ultima_mensagem_em || cliente.created_at,
        nome_cliente: `${cliente.nome} ${cliente.sobrenome || ''}`.trim()
      };
    }).sort((a, b) => new Date(b.ultima_mensagem_em) - new Date(a.ultima_mensagem_em));
  },

  async getMensagens(clienteId) {
    const { data, error } = await supabase
      .from('mensagens_chat')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async enviarMensagemAdmin(clienteId, conteudo, adminId, fileData = null) {
    const payload = {
      cliente_id: clienteId,
      remetente_tipo: 'admin',
      remetente_id: adminId,
      destinatario_tipo: 'cliente',
      destinatario_id: clienteId,
      conteudo,
      tipo: fileData?.tipo || 'texto',
      arquivo_url: fileData?.url || null,
      arquivo_nome: fileData?.nome || null
    };

    const { data: msg, error: msgError } = await supabase
      .from('mensagens_chat')
      .insert(payload)
      .select()
      .single();

    if (msgError) throw msgError;

    const { data: cliente } = await supabase
      .from('clientes')
      .select('nome, sobrenome, email')
      .eq('id', clienteId)
      .maybeSingle();

    if (cliente) {
      await supabase.from('conversas').upsert({
        cliente_id: clienteId,
        nome_cliente: `${cliente?.nome || 'Cliente'} ${cliente?.sobrenome || ''}`.trim(),
        email_cliente: cliente.email,
        ultima_mensagem: fileData ? `📎 ${fileData.nome}` : conteudo,
        ultima_mensagem_em: new Date().toISOString()
      }, { onConflict: 'cliente_id' });
    }

    return msg;
  },

  async enviarMensagemCliente(clienteId, conteudo, fileData = null) {
    const payload = {
      cliente_id: clienteId,
      remetente_tipo: 'cliente',
      remetente_id: clienteId,
      destinatario_tipo: 'admin',
      conteudo,
      tipo: fileData?.tipo || 'texto',
      arquivo_url: fileData?.url || null,
      arquivo_nome: fileData?.nome || null
    };

    const { data: msg, error: msgError } = await supabase
      .from('mensagens_chat')
      .insert(payload)
      .select()
      .single();

    if (msgError) throw msgError;

    const { data: cliente } = await supabase
      .from('clientes')
      .select('nome, sobrenome, email')
      .eq('id', clienteId)
      .maybeSingle();

    if (cliente) {
      await supabase.from('conversas').upsert({
        cliente_id: clienteId,
        nome_cliente: `${cliente?.nome || 'Cliente'} ${cliente?.sobrenome || ''}`.trim(),
        email_cliente: cliente.email,
        ultima_mensagem: fileData ? `📎 ${fileData.nome}` : conteudo,
        ultima_mensagem_em: new Date().toISOString()
      }, { onConflict: 'cliente_id' });
    }

    return msg;
  },

  async marcarComoLida(clienteId) {
    await supabase
      .from('mensagens_chat')
      .update({ lida: true })
      .eq('cliente_id', clienteId)
      .eq('lida', false);
  },

  subscribeConversas(callback) {
    const channelId = `public_notices_${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversas' }, callback)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clientes' }, callback)
      .subscribe();
  },

  subscribeMensagens(clienteId, callback) {
    if (!clienteId) return null;
    return supabase
      .channel(`chat_${clienteId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens_chat',
        filter: `cliente_id=eq.${clienteId}`
      }, (payload) => callback(payload.new))
      .subscribe();
  }
};
