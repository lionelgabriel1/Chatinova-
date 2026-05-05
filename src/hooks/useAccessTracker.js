import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { accessService } from '../services/accessService';
import { logsService } from '../services/logsService';
import { clientAuthService } from '../services/clientAuthService';

export function useAccessTracker() {
  const location = useLocation();
  const lastPath = useRef(null);
  const heartbeatInterval = useRef(null);
  const [user, setUser] = useState(null);
  const trackInProgress = useRef(false);

  useEffect(() => {
    let cancelled = false;
    
    async function resolveUser() {
      try {
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) {
          if (!cancelled) setUser({ id: 'admin', nome: 'Admin', email: 'admin@interno.com', tipo: 'admin' });
          return;
        }

        const cliente = await clientAuthService.getClienteLogado();
        if (cliente && !cancelled) {
          setUser({ ...cliente, tipo: 'cliente' });
          return;
        }
      } catch (e) {
        // ignora
      }

      if (!cancelled) {
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `vis_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitor_id', visitorId);
        }
        setUser({ id: visitorId, nome: 'Visitante', email: 'anonimo@visitante.com', tipo: 'visitante' });
      }
    }

    resolveUser();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user) return;

    const track = async () => {
      // Evita múltiplas execuções simultâneas
      if (trackInProgress.current) return;
      trackInProgress.current = true;

      try {
        const path = location.pathname;
        const aba = document.title || 'InovaChat';

        await Promise.allSettled([
          accessService.updatePresence({
            usuario_id: user.id,
            usuario_tipo: user.tipo,
            nome: user.nome,
            email: user.email,
            rota_atual: path,
            aba_atual: aba,
            user_agent: navigator.userAgent
          }),
          lastPath.current !== path ? accessService.registerAccess({
            usuario_id: user.id,
            usuario_tipo: user.tipo,
            nome: user.nome,
            email: user.email,
            pagina: path,
            origem: lastPath.current || 'Entrada direta',
            user_agent: navigator.userAgent
          }) : Promise.resolve(),
          (user.tipo !== 'visitante') ? logsService.createLog({
            tipo: 'navegacao',
            nivel: 'info',
            titulo: `Acesso a ${path}`,
            descricao: `${user.nome} navegou para ${path}`,
            usuario_tipo: user.tipo,
            usuario_id: user.id,
            usuario_nome: user.nome,
            usuario_email: user.email,
            rota: path,
            aba: aba
          }) : Promise.resolve()
        ]);
        lastPath.current = path;
      } catch (error) {
        // Silencioso
      } finally {
        trackInProgress.current = false;
      }
    };

    track();
    heartbeatInterval.current = setInterval(track, 30000);
    return () => {
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    };
  }, [location.pathname, user]);

  return null;
}
