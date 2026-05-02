import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MoreVertical, ExternalLink, SearchX } from 'lucide-react';
import { supabase } from '../../services/supabase';
import Skeleton from './Skeleton';

export default function RecentClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setClients(data || []);
      setLoading(false);
    };
    fetchClients();
  }, []);

  return (
    <div className="glass-card p-6 border border-slate-800 rounded-2xl h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Últimos Clientes</h3>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="w-24 h-4 rounded-lg" />
                    <Skeleton className="w-32 h-3 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : clients.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {clients.map((client) => (
                <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:border-blue-500/50 transition-colors">
                        {client.nome?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{client.nome}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      client.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {client.status?.toUpperCase() || 'ATIVO'}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-slate-600 gap-3 opacity-50">
            <SearchX size={32} />
            <p className="text-sm">Nenhum cliente cadastrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
