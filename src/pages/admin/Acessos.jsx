import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import StatCard from '../../components/admin/shared/StatCard';
import DataTable from '../../components/admin/shared/DataTable';
import { Activity, Globe, Shield, Clock, Monitor, User as UserIcon, Calendar, MessageSquare, Zap } from 'lucide-react';
import { accessService } from '../../services/accessService';
import { formatDateTime } from '../../utils/date';
import { motion } from 'framer-motion';

export default function Acessos() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [metrics, setMetrics] = useState({ hojeAcessos: 0, semanaAcessos: 0, totalOnline: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [enrichedUsers, stats] = await Promise.all([
        accessService.getEnrichedOnlineUsers(),
        accessService.getAccessMetrics()
      ]);
      setOnlineUsers(enrichedUsers);
      setMetrics(stats);
    } catch (error) {
      console.error('Erro ao buscar dados de acessos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe para atualizações de presença
    const sub = accessService.subscribePresence(() => {
      fetchData();
    });

    return () => sub.unsubscribe();
  }, []);

  const columns = [
    { 
      label: 'Usuário', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${row.usuario_tipo === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
            {row.nome?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-black text-white">{row.nome}</p>
            <p className="text-[10px] text-slate-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      label: 'Tipo', 
      render: (row) => {
        const styles = {
          admin: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
          cliente: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
          visitante: 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        };
        return (
          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${styles[row.usuario_tipo] || styles.visitante}`}>
            {row.usuario_tipo}
          </span>
        );
      }
    },
    { 
      label: 'Aba / Rota', 
      render: (row) => (
        <div>
          <p className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{row.aba_atual || 'InovaChat'}</p>
          <p className="text-[9px] text-slate-500 font-mono">{row.rota_atual}</p>
        </div>
      )
    },
    { 
      label: 'Plano / Vencimento', 
      render: (row) => (row.usuario_tipo === 'admin' || row.usuario_tipo === 'visitante') ? <span className="text-xs text-slate-600">—</span> : (
        <div>
          <p className="text-xs font-bold text-emerald-400">{row.plano}</p>
          <p className={`text-[9px] font-black uppercase ${row.dias_restantes <= 3 ? 'text-red-400' : 'text-slate-500'}`}>
            {row.dias_restantes} dias restantes
          </p>
        </div>
      )
    },
    { 
      label: 'Status', 
      render: (row) => (row.usuario_tipo === 'admin' || row.usuario_tipo === 'visitante') ? <span className="text-xs text-slate-600">—</span> : (
        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
          row.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      label: 'Mensagens', 
      render: (row) => (row.usuario_tipo === 'admin' || row.usuario_tipo === 'visitante') ? <span className="text-xs text-slate-600">—</span> : (
        <div className="flex gap-2">
          <div className="text-center">
            <p className="text-[9px] text-slate-500 font-black uppercase">Rec</p>
            <p className="text-xs font-bold text-white">{row.msgs_recebidas}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-slate-500 font-black uppercase">IA</p>
            <p className="text-xs font-bold text-purple-400">{row.msgs_ia}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-slate-500 font-black uppercase">Sup</p>
            <p className="text-xs font-bold text-blue-400">{row.msgs_suporte}</p>
          </div>
        </div>
      )
    },
    { 
      label: 'Atividade', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <p className="text-xs text-slate-400 font-medium">Ativo agora</p>
        </div>
      )
    },
    { 
      label: 'IP / Navegador', 
      render: (row) => (
        <div>
          <p className="text-[10px] font-mono text-blue-400">{row.ip || 'Localhost'}</p>
          <p className="text-[9px] text-slate-600 truncate max-w-[100px]">{row.user_agent}</p>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader title="Acessos & Presença" subtitle="Monitoramento em tempo real de usuários e clientes online">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-widest">{onlineUsers.length} Online Agora</span>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Online" value={metrics.totalOnline} icon={Activity} color="blue" loading={loading} />
        <StatCard title="Clientes" value={onlineUsers.filter(u => u.usuario_tipo === 'cliente').length} icon={Zap} color="purple" loading={loading} />
        <StatCard title="Visitantes" value={onlineUsers.filter(u => u.usuario_tipo === 'visitante').length} icon={UserIcon} color="slate" loading={loading} />
        <StatCard title="Acessos Hoje" value={metrics.hojeAcessos} icon={Globe} color="green" loading={loading} />
        <StatCard title="Acessos 7 dias" value={metrics.semanaAcessos} icon={Calendar} color="orange" loading={loading} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tighter">Usuários Logados Agora</h3>
          <p className="text-xs text-slate-500">Atualiza automaticamente via Realtime</p>
        </div>
        
        <DataTable 
          columns={columns} 
          data={onlineUsers} 
          loading={loading} 
          emptyMessage="Nenhum usuário logado no momento" 
          mobileRender={(row) => (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${row.usuario_tipo === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                    {row.nome?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-black">{row.nome}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{row.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ativo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Rota / Aba</p>
                  <p className="text-xs font-bold text-slate-300 truncate">{row.aba_atual || 'InovaChat'}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{row.rota_atual}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo / Plano</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                    row.usuario_tipo === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {row.usuario_tipo}
                  </span>
                  {row.usuario_tipo === 'cliente' && (
                    <p className="text-xs font-bold text-emerald-400 mt-1">{row.plano}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Rec</p>
                    <p className="text-xs font-bold text-white">{row.msgs_recebidas || 0}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">IA</p>
                    <p className="text-xs font-bold text-purple-400">{row.msgs_ia || 0}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Sup</p>
                    <p className="text-xs font-bold text-blue-400">{row.msgs_suporte || 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IP / Local</p>
                  <p className="text-[10px] font-mono text-blue-400">{row.ip || 'Localhost'}</p>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </AdminLayout>
  );
}
