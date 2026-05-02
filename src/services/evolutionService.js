import axios from 'axios';
import { supabase } from './supabase';

const EVOLUTION_URL = import.meta.env.VITE_EVOLUTION_URL;
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;

const api = axios.create({
  baseURL: EVOLUTION_URL,
  headers: {
    apikey: API_KEY
  }
});

export const evolutionService = {
  /**
   * Busca todas as instâncias da Evolution GO
   * Versão Go: /instance/all
   */
  async getAllInstances() {
    try {
      const response = await api.get('instance/all');
      // A Evolution GO retorna um array diretamente ou dentro de um objeto
      return Array.isArray(response.data) ? response.data : response.data.instances || [];
    } catch (error) {
      console.error('Erro ao buscar instâncias da Evolution:', error);
      throw error;
    }
  },

  /**
   * Busca o status de uma instância específica
   */
  async getInstanceStatus(instanceName) {
    const response = await api.get(`instance/connectionState/${instanceName}`);
    return response.data;
  },

  /**
   * Reinicia uma instância
   */
  async restartInstance(instanceName) {
    const response = await api.post(`instance/restart/${instanceName}`);
    return response.data;
  },

  /**
   * Deleta uma instância da Evolution
   */
  async deleteInstance(instanceName) {
    const response = await api.delete(`instance/delete/${instanceName}`);
    return response.data;
  },

  /**
   * Busca o QR Code para conexão
   */
  async getQRCode(instanceName) {
    const response = await api.get(`instance/connect/${instanceName}`);
    return response.data; 
  },

  /**
   * Sincroniza as instâncias da API com o Banco de Dados (Supabase)
   */
  async syncInstancesWithDatabase() {
    try {
      const evolutionInstances = await this.getAllInstances();
      
      for (const instance of evolutionInstances) {
        // Mapeamento de campos da Evolution GO
        const name = instance.instanceName || instance.name || instance.instance?.name;
        const status = instance.status || (instance.connectionState?.state) || 'disconnected';
        const number = instance.owner || instance.number;
        const isConnected = status === 'open' || status === 'CONNECTED';

        if (!name) continue;

        // Upsert no Supabase usando instance_name como chave única
        const { error } = await supabase
          .from('instancias')
          .upsert({
            instance_name: name,
            nome_instancia: name, 
            status: status,
            conectado: isConnected,
            numero_whatsapp: number || null,
            updated_at: new Date().toISOString()
          }, { onConflict: 'instance_name' });

        if (error) console.error(`Erro ao sincronizar instância ${name}:`, error);
      }
      
      return evolutionInstances;
    } catch (error) {
      console.error('Falha na sincronização:', error);
      throw error;
    }
  }
};
