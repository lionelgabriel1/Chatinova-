import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Zap, AlertCircle, ExternalLink } from 'lucide-react';
import { systemAlertsService } from '../../services/systemAlertsService';

export default function RealtimeAlertsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [criticalCount, setCriticalCount] = useState(0);

  const fetchData = async () => {
    try {
      const [list, count] = await Promise.all([
        systemAlertsService.getActiveAlerts(),
        systemAlertsService.getCriticalAlertsCount()
      ]);
      setAlerts(list);
      setCriticalCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const sub = systemAlertsService.subscribeAlerts(() => fetchData());
    return () => sub.unsubscribe();
  }, []);

  const handleResolve = async (id) => {
    await systemAlertsService.resolveAlert(id);
    fetchData();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
          criticalCount > 0 
          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse hover:bg-red-500/20' 
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
        }`}
      >
        <ShieldAlert size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">
          {criticalCount > 0 ? `${criticalCount} Alertas Críticos` : 'Alertas'}
        </span>
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
                <span className="text-xs font-bold text-white uppercase tracking-wider">Alertas Ativos</span>
                <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-800 uppercase font-black">Realtime</span>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500/20 mb-2" />
                    <p className="text-xs text-slate-500">Tudo sob controle. Nenhum alerta ativo.</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all group ${
                        alert.nivel === 'critical' ? 'bg-red-500/5' : 
                        alert.nivel === 'error' ? 'bg-orange-500/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-xl h-fit ${
                          alert.nivel === 'critical' ? 'bg-red-500/10 text-red-500' :
                          alert.nivel === 'error' ? 'bg-orange-500/10 text-orange-500' :
                          alert.nivel === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {alert.nivel === 'critical' ? <Zap size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white">{alert.titulo}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{alert.descricao}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              onClick={() => handleResolve(alert.id)}
                              className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest"
                            >
                              Resolver
                            </button>
                            <button className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest flex items-center gap-1">
                              Detalhes <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
