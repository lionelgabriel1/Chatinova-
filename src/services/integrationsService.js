import { supabase } from './supabase';
import axios from 'axios';

export const integrationsService = {
  async testSupabase() {
    try {
      const { data, error } = await supabase.from('configuracoes_sistema').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return { status: 'online', message: 'Conexão com Supabase estável.' };
    } catch (e) {
      return { status: 'offline', message: e.message };
    }
  },

  async testGroq(apiKey, model) {
    if (!apiKey) return { status: 'offline', message: 'API Key não configurada.' };
    try {
      // Simulação de chamada real ou chamada via proxy
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: model || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      }, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return { status: 'online', message: 'Groq API respondendo corretamente.' };
    } catch (e) {
      return { status: 'offline', message: e.response?.data?.error?.message || e.message };
    }
  },

  async testEvolution(url, key) {
    if (!url || !key) return { status: 'offline', message: 'URL ou Key não configurada.' };
    try {
      const response = await axios.get(`${url}/instance/fetchInstances`, {
        headers: { 'apikey': key }
      });
      return { status: 'online', message: 'Gateway Evolution conectado.' };
    } catch (e) {
      return { status: 'offline', message: 'Erro ao conectar com o gateway.' };
    }
  }
};
