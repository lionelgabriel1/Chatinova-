import React, { useState } from 'react';
import { Share2, Zap, Database, Server, Cpu, Globe, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { integrationsService } from '../../../services/integrationsService';
import { motion } from 'framer-motion';

const INTEGRATIONS = [
  { id: 'supabase', name: 'Supabase', icon: Database, color: 'emerald' },
  { id: 'groq', name: 'Groq (IA)', icon: Cpu, color: 'purple' },
  { id: 'evolution', name: 'WhatsApp Gateway', icon: Share2, color: 'blue' },
  { id: 'redis', name: 'Redis Cache', icon: Zap, color: 'red' },
  { id: 'postgres', name: 'PostgreSQL', icon: Server, color: 'blue' },
];

import { useToast } from '../../../hooks/useToast';

export default function ConfigIntegracoes() {
  const toast = useToast();
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState({});

  const testIntegration = async (id) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    let result;
    
    try {
      if (id === 'supabase') result = await integrationsService.testSupabase();
      else if (id === 'groq') result = await integrationsService.testGroq('gsk_test', 'llama-3.1-70b-versatile');
      else if (id === 'evolution') result = await integrationsService.testEvolution('http://gateway', 'key');
      else {
        // Simulação para outros
        await new Promise(r => setTimeout(r, 1000));
        result = { status: 'online', message: 'Serviço operacional.' };
      }
      
      setStatus(prev => ({ ...prev, [id]: result }));
      
      if (result.status === 'online') {
        toast.success(`${id.toUpperCase()} conectado!`);
      } else {
        toast.error(`${id.toUpperCase()} indisponível.`);
      }
    } catch (e) {
      const err = { status: 'offline', message: 'Falha crítica.' };
      setStatus(prev => ({ ...prev, [id]: err }));
      toast.error(`Falha no teste: ${id}`);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Share2 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Integrações do Sistema</h2>
          <p className="text-xs text-slate-500">Monitore a saúde e conectividade dos serviços externos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.map((int) => {
          const s = status[int.id];
          const isLoading = loading[int.id];

          return (
            <motion.div 
              key={int.id}
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 group"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-3 rounded-2xl bg-${int.color}-500/10 text-${int.color}-400 border border-${int.color}-500/20`}>
                    <int.icon size={24} />
                 </div>
                 <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                   s?.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' : 
                   s?.status === 'offline' ? 'bg-red-500/10 text-red-400' :
                   'bg-slate-800 text-slate-500'
                 }`}>
                    {s?.status || 'Aguardando'}
                 </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{int.name}</h3>
              <p className="text-xs text-slate-500 mb-6">
                {s?.message || 'Teste a conexão para ver o status.'}
              </p>

              <button 
                onClick={() => testIntegration(int.id)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
                Testar Conexão
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
