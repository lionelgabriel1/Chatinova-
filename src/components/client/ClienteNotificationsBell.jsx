import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Info, 
  AlertTriangle, 
  MessageSquare,
  Clock,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';

export default function ClienteNotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const cliente = clientAuthService.getClienteLogado();
  const toast = useToast();

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notificacoes_clientes')
        .select('*')
        .eq('cliente_id', cliente.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notificacoes_clientes')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Erro ao marcar como lida.');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notificacoes_clientes')
        .update({ lida: true })
        .eq('cliente_id', cliente.id)
        .eq('lida', false);

      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
      toast.success('Todas lidas!');
    } catch (error) {
      toast.error('Erro ao marcar todas como lidas.');
    }
  };

  useEffect(() => {
    if (cliente) {
      fetchNotifications();

      const channel = supabase
        .channel(`notifications_${cliente.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notificacoes_clientes',
          filter: `cliente_id=eq.${cliente.id}`
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(`🔔 ${payload.new.titulo}`);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [cliente]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'warning': return <AlertTriangle className="text-orange-400" size={18} />;
      case 'message': return <MessageSquare className="text-blue-400" size={18} />;
      default: return <Info className="text-purple-400" size={18} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
      >
        <Bell size={22} className={unreadCount > 0 ? 'animate-bounce-slow' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full border-2 border-[#020617] text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-purple-600/40">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl z-[100] overflow-hidden backdrop-blur-2xl"
          >
            {/* Dropdown Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Notificações</h4>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={14} /> Ler Tudo
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell size={40} className="mx-auto text-slate-700 mb-4 opacity-20" />
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Tudo limpo por aqui!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => !n.lida && markAsRead(n.id)}
                    className={`p-5 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative group ${!n.lida ? 'bg-purple-600/5' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
                        {getIcon(n.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className={`text-sm font-bold truncate ${!n.lida ? 'text-white' : 'text-slate-400'}`}>
                            {n.titulo}
                          </h5>
                          {!n.lida && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                          {n.mensagem}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase text-slate-600 flex items-center gap-1">
                            <Clock size={10} /> {new Date(n.created_at).toLocaleDateString()}
                          </span>
                          {!n.lida && (
                            <button className="text-[9px] font-black text-purple-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View All */}
            <div className="p-4 bg-white/5 text-center">
              <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">
                Ver todo o histórico
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
