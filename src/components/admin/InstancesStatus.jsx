import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Power, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import Skeleton from './Skeleton';

export default function InstancesStatus() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('instancias')
      .select('*, clientes(nome)')
      .limit(5);
    setInstances(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInstances();

    const subscription = supabase
      .channel('instancias_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instancias' }, () => {
        fetchInstances();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="glass-card p-6 border border-slate-800 rounded-2xl h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Database size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Status das Instâncias</h3>
        </div>
        <button 
          onClick={fetchInstances}
          disabled={loading}
          className={`p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-all ${loading ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="w-20 h-4 rounded-lg" />
                  <Skeleton className="w-24 h-2 rounded-lg" />
                </div>
              </div>
              <Skeleton className="w-12 h-4 rounded-lg" />
            </div>
          ))
        ) : instances.length > 0 ? (
          instances.map((instance) => (
            <div key={instance.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl ${
                  instance.conectado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  <Database size={18} />
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    instance.conectado ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white line-clamp-1">{instance.nome_instancia || instance.instance_name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider line-clamp-1">
                    {instance.clientes?.nome || 'Sem Proprietário'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-[10px] font-bold ${instance.conectado ? 'text-emerald-400' : 'text-red-400'}`}>
                    {instance.conectado ? 'ONLINE' : 'OFFLINE'}
                  </p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                  <Power size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-slate-600 gap-3 opacity-50">
            <AlertTriangle size={32} />
            <p className="text-sm text-center">Nenhuma instância <br/> cadastrada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
