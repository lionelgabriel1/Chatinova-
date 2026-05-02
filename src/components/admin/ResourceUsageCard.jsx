import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, MessageCircle, Users, Activity } from 'lucide-react';
import { resourceUsageService } from '../../services/resourceUsageService';

export default function ResourceUsageCard() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await resourceUsageService.getResourceUsage();
        setUsage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
    const interval = setInterval(fetchUsage, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="w-48 h-10 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"></div>
  );

  const getProgressColor = (percent) => {
    if (percent > 85) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
    if (percent > 60) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="hidden xl:flex items-center gap-6 px-6 py-3 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl group"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recursos</span>
            <span className="text-[10px] font-bold text-white font-mono">{usage.cargaSistema}%</span>
          </div>
          <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usage.cargaSistema}%` }}
              className={`h-full transition-all duration-1000 ${getProgressColor(usage.cargaSistema)}`}
            />
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800"></div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">IA</span>
            <p className="text-xs font-black text-white font-mono">{usage.mensagensHoje}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">WPP</span>
            <p className="text-xs font-black text-white font-mono">{usage.instanciasConectadas}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0.5">USR</span>
            <p className="text-xs font-black text-white font-mono">{usage.clientesAtivos}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
