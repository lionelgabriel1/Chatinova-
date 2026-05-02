import React, { useState, useEffect } from 'react';
import { CreditCard, Database, MessageSquare, RefreshCw, Check, Star } from 'lucide-react';
import { planosService } from '../../../services/planosService';
import { useToast } from '../../../hooks/useToast';
import { motion } from 'framer-motion';

export default function ConfigPlanos() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPlanos = async () => {
    setLoading(true);
    try {
      const data = await planosService.getPlanos();
      setPlanos(data);
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível carregar os planos. Verifique a tabela no banco.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CreditCard size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Planos do Sistema</h2>
            <p className="text-xs text-slate-500">Planos fixos com limites de mensagens e instâncias WhatsApp</p>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          Planos Gerenciados pelo Sistema
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-[400px] rounded-[2.5rem] bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))
        ) : (
          planos.map((plano) => {
            const isPro = plano.nome === 'Pro';
            const isEnterprise = plano.nome === 'Enterprise';
            
            return (
              <motion.div 
                key={plano.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-10 rounded-[3rem] bg-slate-900/40 border transition-all flex flex-col relative overflow-hidden group ${
                  isPro ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {isPro && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20">
                    <Star size={10} fill="currentColor" />
                    Recomendado
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{plano.nome}</h3>
                  <div className="h-1 w-12 bg-blue-600 rounded-full" />
                </div>

                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className={`p-2 rounded-xl ${isPro ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                      <MessageSquare size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mensagens</span>
                      <span className="text-lg font-black text-white leading-tight">
                        {plano.limite_mensagens ? plano.limite_mensagens.toLocaleString() : 'Ilimitadas'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300">
                    <div className={`p-2 rounded-xl ${isPro ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Database size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instâncias WA</span>
                      <span className="text-lg font-black text-white leading-tight">
                        {plano.limite_instancias} {plano.limite_instancias === 1 ? 'Conexão' : 'Conexões'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Vantagens incluídas</p>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">Dashboard Administrativo</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">API Evolution GO</span>
                    </div>
                    {isEnterprise && (
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium">Suporte Prioritário</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ID do Sistema</span>
                    <span className="text-[10px] font-mono text-slate-500 opacity-50">{plano.id.split('-')[0]}...</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
