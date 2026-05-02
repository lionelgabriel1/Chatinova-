import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { accessService } from '../services/accessService';
import { logsService } from '../services/logsService';
import { clientAuthService } from '../services/clientAuthService';
import { supabase } from '../services/supabase';

export function useAccessTracker(userType = 'cliente') {
  const location = useLocation();
  const lastPath = useRef(null);
  const heartbeatInterval = useRef(null);

  const getUserData = async () => {
    // 1. Verificar se é Admin
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      try {
        const adminData = JSON.parse(adminToken);
        return {
          id: adminData.id || 'admin-id',
          nome: 'Administrador',
          email: adminData.email || 'admin@inovachat.com',
          tipo: 'admin'
        };
      } catch (e) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            nome: 'Administrador',
            email: session.user.email,
            tipo: 'admin'
          };
        }
      }
    }

    // 2. Verificar se é Cliente logado
    const cliente = clientAuthService.getClienteLogado();
    if (cliente) {
      return { ...cliente, tipo: 'cliente' };
    }

    // 3. Se não for nenhum, é um Visitante
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `vis_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('visitor_id', visitorId);
    }

    return {
      id: visitorId,
      nome: 'Visitante',
      email: 'anonimo@visitante.com',
      tipo: 'visitante'
    };
  };

  const track = async () => {
    const user = await getUserData();
    if (!user) return;

    const path = location.pathname;
    const aba = document.title || 'InovaChat';

    // 1. Atualizar Presença
    await accessService.updatePresence({
      usuario_id: user.id,
      usuario_tipo: user.tipo,
      nome: user.nome,
      email: user.email,
      rota_atual: path,
      aba_atual: aba,
      user_agent: navigator.userAgent
    });

    // 2. Registrar Acesso se mudou de rota
    if (lastPath.current !== path) {
      await accessService.registerAccess({
        usuario_id: user.id,
        usuario_tipo: user.tipo,
        nome: user.nome,
        email: user.email,
        pagina: path,
        origem: lastPath.current || 'Entrada direta',
        user_agent: navigator.userAgent
      });

      // 3. Criar Log de Navegação (Apenas para Admin e Cliente para não sobrecarregar logs com visitantes)
      if (user.tipo !== 'visitante') {
        await logsService.createLog({
          tipo: 'navegacao',
          nivel: 'info',
          titulo: `Acesso a ${path}`,
          descricao: `Usuário ${user.nome} navegou para ${path}`,
          usuario_tipo: user.tipo,
          usuario_id: user.id,
          usuario_nome: user.nome,
          usuario_email: user.email,
          rota: path,
          aba: aba
        });
      }

      lastPath.current = path;
    }
  };

  useEffect(() => {
    track();

    // Heartbeat a cada 30 segundos
    heartbeatInterval.current = setInterval(track, 30000);

    return () => {
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    };
  }, [location.pathname]);

  return null;
}
