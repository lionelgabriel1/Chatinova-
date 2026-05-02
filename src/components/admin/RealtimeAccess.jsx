import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, MapPin, EyeOff, Shield } from 'lucide-react';
import { accessService } from '../../services/accessService';
import Skeleton from './Skeleton';

export default function RealtimeAccess() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const users = await accessService.getOnlineUsers();
      // Filtrar para mostrar os mais recentes primeiro
      setOnlineUsers(users.slice(0, 20));
    } catch (error) {
      console.error('Erro ao buscar usuários online:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe para mudanças na tabela de presença
    const subscription = accessService.subscribePresence(() => {
      fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="glass-card border border-slate-800 rounded-2xl flex flex-col h-[500px] overflow-hidden">
      {/* Header - FIXO */}
      <div className="p-6 pb-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Visitantes Online</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Usuários Ativos Agora</p>
          </div>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{onlineUsers.length}</span>
          </div>
        )}
      </div>

      {/* Lista de Usuários - SCROLL INTERNO */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/30">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-32 h-3 rounded-lg" />
                <Skeleton className="w-24 h-2 rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence initial={false}>
            {onlineUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
              >
                {/* Avatar / Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${
                  user.usuario_tipo === 'admin' ? 'bg-indigo-600/20 text-indigo-400' :
                  user.usuario_tipo === 'cliente' ? 'bg-blue-600/20 text-blue-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {user.usuario_tipo === 'admin' ? <Shield size={18} /> : 
                   user.usuario_tipo === 'cliente' ? <User size={18} /> : 
                   <Globe size={18} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-white truncate">{user.nome || 'Visitante Anônimo'}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                      user.usuario_tipo === 'admin' ? 'bg-indigo-500/20 text-indigo-400' :
                      user.usuario_tipo === 'cliente' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700 text-slate-500'
                    }`}>
                      {user.usuario_tipo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MapPin size={10} className="text-slate-600" />
                    <span className="truncate">{user.rota_atual || '/'}</span>
                  </div>
                </div>

                {/* Status Dot */}
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && onlineUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 opacity-50 py-20">
            <EyeOff size={40} />
            <p className="text-sm font-medium">Ninguém online agora</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-800/50 flex justify-center">
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Sincronizado via Realtime</p>
      </div>
    </div>
  );
}
