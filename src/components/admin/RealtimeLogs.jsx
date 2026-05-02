import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, AlertCircle, Clock, Search } from 'lucide-react';
import { supabase } from '../../services/supabase';
import Skeleton from './Skeleton';

export default function RealtimeLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('logs_sistema')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();

    const subscription = supabase
      .channel('logs_sistema_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs_sistema' }, (payload) => {
        setLogs(current => [payload.new, ...current].slice(0, 10));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getIcon = (nivel) => {
    switch (nivel) {
      case 'success': return <ShieldCheck className="text-emerald-400" size={16} />;
      case 'error': return <AlertCircle className="text-red-400" size={16} />;
      case 'warning': return <AlertCircle className="text-orange-400" size={16} />;
      default: return <Clock className="text-blue-400" size={16} />;
    }
  };

  return (
    <div className="glass-card p-6 border border-slate-800 rounded-2xl flex flex-col gap-6 h-full min-h-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Logs do Sistema</h3>
        </div>
        {!loading && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Realtime</span>
          </div>
        )}
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4 p-3">
              <Skeleton className="w-4 h-4 rounded-full mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-24 h-4 rounded-lg" />
                <Skeleton className="w-full h-3 rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="mt-1">{getIcon(log.nivel)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200">{log.titulo}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.descricao}</p>
                </div>
                <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap mt-1">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-slate-600 gap-3 opacity-50">
            <Search size={32} />
            <p className="text-sm">Nenhum log encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
