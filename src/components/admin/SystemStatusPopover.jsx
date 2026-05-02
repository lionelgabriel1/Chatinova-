import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { systemServicesService } from '../../services/systemServicesService';

export default function SystemStatusPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await systemServicesService.getSystemServices();
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const sub = systemServicesService.subscribeSystemServices(() => fetchServices());
    return () => sub.unsubscribe();
  }, []);

  const getGlobalStatus = () => {
    if (services.some(s => s.status === 'offline')) return { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (services.some(s => s.status === 'warning')) return { label: 'Instável', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Saudável', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  const status = getGlobalStatus();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${isOpen ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
      >
        <div className={`w-2 h-2 rounded-full animate-pulse ${status.color.replace('text', 'bg')}`}></div>
        <span className={`text-xs font-bold uppercase tracking-widest ${status.color}`}>{status.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-72 z-50 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Status dos Serviços</span>
                </div>
                <button onClick={fetchServices} className="text-slate-500 hover:text-white transition-colors">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {services.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        service.status === 'online' ? 'bg-emerald-500' : 
                        service.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-xs font-bold text-white capitalize">{service.service_name.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-500">{service.latency_ms}ms latência</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      service.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 
                      service.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-600">Última checagem: {new Date().toLocaleTimeString()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
