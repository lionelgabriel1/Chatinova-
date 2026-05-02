import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, ExternalLink, UserPlus, Bug } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function AdminMessageNotifier({ onCountChange }) {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar contagens
    const updateCounts = async () => {
      const [msgCount, reqCount, bugCount] = await Promise.all([
        notificationService.getUnreadMessagesCount(),
        notificationService.getPendingRequestsCount(),
        notificationService.getOpenBugsCount()
      ]);
      
      if (onCountChange) {
        onCountChange({ 
          messages: msgCount, 
          requests: reqCount,
          bugs: bugCount,
          total: msgCount + reqCount + bugCount
        });
      }
    };

    updateCounts();

    // Subscribe Realtime Global
    const subscription = notificationService.subscribeAll((notif) => {
      if (notif.type === 'update_message_count' || notif.type === 'update_request_count') {
        updateCounts();
      } else if (notif.type === 'new_message') {
        const data = notif.data;
        setNotification({
          id: data.id,
          tipo: 'mensagem',
          titulo: 'Nova Mensagem',
          nome: data.cliente_nome,
          texto: data.conteudo || (data.tipo === 'imagem' ? '📎 Enviou uma imagem' : '📎 Enviou um arquivo'),
          clienteId: data.cliente_id,
          icon: <MessageSquare size={24} />,
          color: 'bg-indigo-600',
          shadow: 'shadow-indigo-600/20',
          border: 'border-indigo-500/30',
          glow: 'bg-indigo-500',
          actionText: 'Ver Conversa'
        });
        updateCounts();
        playNotificationSound();

        setTimeout(() => {
          setNotification(prev => prev?.id === data.id ? null : prev);
        }, 8000);
      } else if (notif.type === 'new_request') {
        const data = notif.data;
        setNotification({
          id: data.id,
          tipo: 'solicitacao',
          titulo: 'Nova Solicitação',
          nome: `${data.nome} ${data.sobrenome || ''}`.trim(),
          texto: `Novo cadastro aguardando aprovação (${data.email})`,
          icon: <UserPlus size={24} />,
          color: 'bg-emerald-600',
          shadow: 'shadow-emerald-600/20',
          border: 'border-emerald-500/30',
          glow: 'bg-emerald-500',
          actionText: 'Analisar Cadastro'
        });
        updateCounts();
        playNotificationSound('request');

        setTimeout(() => {
          setNotification(prev => prev?.id === data.id ? null : prev);
        }, 8000);
      } else if (notif.type === 'new_bug' || notif.type === 'update_bug_count') {
        if (notif.type === 'new_bug') {
          const data = notif.data;
          setNotification({
            id: data.id,
            tipo: 'bug',
            titulo: 'Novo Bug Reportado',
            nome: data.titulo,
            texto: `Prioridade: ${data.prioridade.toUpperCase()} - ${data.pagina}`,
            icon: <Bug size={24} />,
            color: 'bg-amber-600',
            shadow: 'shadow-amber-600/20',
            border: 'border-amber-500/30',
            glow: 'bg-amber-500',
            actionText: 'Analisar Bug'
          });
          playNotificationSound('bug');
          
          setTimeout(() => {
            setNotification(prev => prev?.id === data.id ? null : prev);
          }, 8000);
        }
        updateCounts();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [onCountChange]);

  const playNotificationSound = (type = 'message') => {
    try {
      let url = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';
      if (type === 'request') url = 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3';
      if (type === 'bug') url = 'https://assets.mixkit.co/active_storage/sfx/2350/2350-preview.mp3';
      
      const audio = new Audio(url);
      audio.volume = 0.3;
      audio.play();
    } catch (e) {}
  };

  const handleAction = () => {
    if (!notification) return;
    
    if (notification.tipo === 'mensagem') {
      navigate('/admin/mensagens', { state: { selectedClienteId: notification.clienteId } });
    } else if (notification.tipo === 'solicitacao') {
      navigate('/admin/solicitacoes');
    } else if (notification.tipo === 'bug') {
      navigate('/admin/bugs');
    }
    setNotification(null);
  };

  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto w-80 bg-slate-900/90 backdrop-blur-2xl border ${notification.border} rounded-3xl p-6 shadow-2xl relative overflow-hidden`}
          >
            {/* Efeito Glow Neon */}
            <div className={`absolute top-0 left-0 w-1 h-full ${notification.glow} shadow-[0_0_15px_rgba(99,102,241,0.8)]`} />
            
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${notification.color} flex items-center justify-center text-white shrink-0 shadow-lg ${notification.shadow}`}>
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-80`}>{notification.titulo}</h4>
                  <button 
                    onClick={() => setNotification(null)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm font-black text-white truncate mb-1">
                  {notification.nome}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  "{notification.texto}"
                </p>
                
                <button
                  onClick={handleAction}
                  className={`w-full py-2.5 ${notification.color} hover:brightness-110 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group`}
                >
                  {notification.actionText}
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
