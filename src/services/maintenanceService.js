import { supabase } from './supabase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const maintenanceService = {
  /**
   * Busca status atual do modo manutenção
   */
  async getStatus() {
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('valor')
        .eq('chave', 'maintenance_mode')
        .single();

      if (error) throw error;
      return data.valor;
    } catch (error) {
      console.error('Erro getMaintenanceStatus:', error);
      return { enabled: false };
    }
  },

  /**
   * Verifica senha no backend
   */
  async verifyPassword(password) {
    try {
      const response = await axios.post(`${API_URL}/maintenance/verify`, { password });
      return response.data.success;
    } catch (error) {
      console.error('Erro verifyMaintenancePassword:', error);
      return false;
    }
  },

  /**
   * Atualiza configurações (Admin)
   */
  async updateConfig(enabled, password = null) {
    try {
      const response = await axios.post(`${API_URL}/maintenance/update`, { enabled, password });
      return response.data;
    } catch (error) {
      console.error('Erro updateMaintenanceConfig:', error);
      throw error;
    }
  },

  /**
   * Escuta mudanças em tempo real
   */
  subscribeStatus(onUpdate) {
    const channelName = `maintenance_realtime_${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'configuracoes_sistema',
          filter: 'chave=eq.maintenance_mode'
        },
        (payload) => {
          onUpdate(payload.new.valor);
        }
      )
      .subscribe();
  },

  /**
   * Gerenciamento de sessão
   */
  isUnlocked() {
    return sessionStorage.getItem('maintenance_unlocked') === 'true';
  },

  setUnlocked(value) {
    if (value) {
      sessionStorage.setItem('maintenance_unlocked', 'true');
    } else {
      sessionStorage.removeItem('maintenance_unlocked');
    }
  }
};
