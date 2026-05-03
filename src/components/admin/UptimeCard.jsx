import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { systemStatusService } from '../../services/systemStatusService';
import { differenceInSeconds } from 'date-fns';

export default function UptimeCard({ 
  serviceName = 'inovachat-admin', 
  title = 'Tempo de Atividade',
  compact = false 
}) {
  const [startTime, setStartTime] = useState(null);
  const [uptime, setUptime] = useState('00d 00h 00m 00s');
  const [loading, setLoading] = useState(true);

  const calculateUptime = useCallback((start) => {
    if (!start) return compact ? '00d 00h 00m' : '00d 00h 00m 00s';
    
    const now = new Date();
    const startDate = new Date(start);
    const totalSeconds = differenceInSeconds(now, startDate);
    
    if (totalSeconds < 0) return compact ? '00d 00h 00m' : '00d 00h 00m 00s';

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const status = await systemStatusService.getOrCreateSystemStatus(serviceName);
        setStartTime(status.started_at);
      } catch (error) {
        console.error('Erro ao buscar uptime:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [serviceName]);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setUptime(calculateUptime(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, calculateUptime]);

  if (compact) {
    return (
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl group transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <Activity size={14} />
          </div>
          {loading ? (
            <div className="w-24 h-4 bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <span className="text-sm font-bold text-emerald-400 font-mono tracking-tight">
              {uptime}
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">Online</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card relative overflow-hidden p-6 border border-emerald-500/20 rounded-3xl bg-slate-900/40 group hover:border-emerald-500/40 transition-all duration-500"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <Activity size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-500 tracking-wider">ONLINE</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {loading ? (
          <div className="h-10 w-48 bg-slate-800 animate-pulse rounded-lg mb-2"></div>
        ) : (
          <motion.p 
            key={uptime}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-black text-white font-mono tracking-tighter"
          >
            {uptime}
          </motion.p>
        )}
        
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock size={12} />
          Sistema online desde {startTime ? new Date(startTime).toLocaleString('pt-BR') : '---'}
        </p>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
}
