import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Inbox, MessageSquare, AlertTriangle, X } from 'lucide-react';
import { adminNotificationsService } from '../../services/adminNotificationsService';
import { useToast } from '../../hooks/useToast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminNotificationsPopover() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = async () => {
    try {
      const [list, count] = await Promise.all([
        adminNotificationsService.getRecentNotifications(),
        adminNotificationsService.getUnreadNotificationsCount()
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const sub = adminNotificationsService.subscribeAdminNotifications((payload) => {
      fetchData();
      const newNotif = payload.new;
      if (newNotif.tipo === 'error') toast.error(newNotif.titulo);
      else if (newNotif.tipo === 'warning') toast.warning(newNotif.titulo);
      else toast.success(newNotif.titulo);
    });
    return () => sub.unsubscribe();
  }, []);

  const handleMarkAllRead = async () => {
    await adminNotificationsService.markAllNotificationsAsRead();
    fetchData();
  };

  const handleMarkRead = async (id) => {
    await adminNotificationsService.markNotificationAsRead(id);
    fetchData();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 z-50 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notificações</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest flex items-center gap-1">
                    <CheckCheck size={12} />
                    Limpar tudo
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Inbox size={32} className="mx-auto text-slate-700 mb-2" />
                    <p className="text-xs text-slate-500">Nenhuma notificação por aqui.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all group relative ${!notif.lida ? 'bg-blue-500/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-xl h-fit ${
                          notif.tipo === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                          notif.tipo === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                          notif.tipo === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {notif.tipo === 'error' ? <AlertTriangle size={14} /> : <MessageSquare size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${!notif.lida ? 'text-white' : 'text-slate-400'}`}>{notif.titulo}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{notif.mensagem}</p>
                          <p className="text-[10px] text-slate-600 mt-2">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                        {!notif.lida && (
                          <button 
                            onClick={() => handleMarkRead(notif.id)}
                            className="text-slate-600 hover:text-white transition-colors p-1"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-center">
                <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
