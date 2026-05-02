import { supabase } from './supabase';
import { logsService } from './logsService';

export const bugReportService = {
  /**
   * Upload de anexo para o bug
   */
  async uploadBugAttachment(file, cliente_id, bug_id) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${cliente_id}/${bug_id}/${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('bug_anexos')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('bug_anexos')
        .getPublicUrl(filePath);

      return { url: publicUrl, name: file.name };
    } catch (error) {
      console.error('Erro no upload do anexo:', error);
      await logsService.createLog({
        tipo: 'erro',
        nivel: 'error',
        titulo: 'Erro Upload Bug',
        descricao: `Falha ao subir anexo para o bug: ${error.message}`
      });
      throw error;
    }
  },

  /**
   * Cria um novo report de bug
   */
  async createBugReport(bugData, file) {
    try {
      // 1. Criar o registro inicial para pegar o ID se precisar (ou gerar um UUID aqui)
      const bugId = crypto.randomUUID();
      let anexo = { url: null, name: null };

      // 2. Se tiver arquivo, faz upload
      if (file) {
        anexo = await this.uploadBugAttachment(file, bugData.cliente_id, bugId);
      }

      // 3. Inserir no banco
      const { data, error } = await supabase
        .from('bug_reports')
        .insert([{
          id: bugId,
          ...bugData,
          anexo_url: anexo.url,
          anexo_nome: anexo.name,
          status: 'aberto'
        }])
        .select()
        .single();

      if (error) throw error;

      // 4. Log e Notificação (Lógica de notificação seria via outra tabela ou trigger)
      await logsService.createLog({
        tipo: 'operacao',
        nivel: 'info',
        titulo: 'Bug Reportado',
        descricao: `Novo bug reportado: ${bugData.titulo}`,
        usuario_id: bugData.cliente_id,
        usuario_tipo: 'cliente'
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar bug report:', error);
      throw error;
    }
  },

  /**
   * Busca bugs do cliente logado
   */
  async getMyBugReports(cliente_id) {
    const { data, error } = await supabase
      .from('bug_reports')
      .select('*')
      .eq('cliente_id', cliente_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Busca bug por ID com respostas
   */
  async getBugById(id) {
    const { data, error } = await supabase
      .from('bug_reports')
      .select(`
        *,
        respostas:bug_respostas(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Adiciona resposta ao bug
   */
  async addBugResponse(bugId, responseData) {
    const { data, error } = await supabase
      .from('bug_respostas')
      .insert([{
        bug_id: bugId,
        ...responseData
      }])
      .select()
      .single();

    if (error) throw error;

    // Atualizar updated_at do bug
    await supabase
      .from('bug_reports')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', bugId);

    return data;
  },

  /**
   * Funções Admin: Busca todos os bugs
   */
  async getAllBugReports(filters = {}) {
    let query = supabase
      .from('bug_reports')
      .select(`
        *,
        clientes(nome, email)
      `)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status);
    }
    if (filters.prioridade && filters.prioridade !== 'todas') {
      query = query.eq('prioridade', filters.prioridade);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Atualiza status do bug
   */
  async updateBugStatus(id, status) {
    const { data, error } = await supabase
      .from('bug_reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await logsService.createLog({
      tipo: 'operacao',
      nivel: 'info',
      titulo: 'Status de Bug Alterado',
      descricao: `Bug ${id} alterado para status ${status}`
    });

    return data;
  },

  /**
   * Realtime: Assinar mudanças nos bugs
   */
  subscribeBugs(callback) {
    return supabase
      .channel('bug_reports_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bug_reports' }, callback)
      .subscribe();
  },

  /**
   * Realtime: Assinar respostas de um bug específico
   */
  subscribeBugResponses(bugId, callback) {
    return supabase
      .channel(`bug_responses_${bugId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bug_respostas',
        filter: `bug_id=eq.${bugId}`
      }, callback)
      .subscribe();
  }
};
