import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import StatCard from '../../components/admin/shared/StatCard';
import DataTable from '../../components/admin/shared/DataTable';
import StatusBadge from '../../components/admin/shared/StatusBadge';
import ActionButton from '../../components/admin/shared/ActionButton';
import { MessageSquare, RefreshCw, Download, Filter, User, Bot, Server, Eye, Copy } from 'lucide-react';
import { mensagensService } from '../../services/mensagensService';
import { formatDateTime } from '../../utils/date';
import { supabase } from '../../services/supabase';

export default function Mensagens() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, ia: 0, user: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [list, metrics] = await Promise.all([
        mensagensService.getAll(),
        mensagensService.getStats()
      ]);
      setData(list);
      setStats(metrics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const sub = supabase.channel('mensagens_realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, () => fetchData()).subscribe();
    return () => sub.unsubscribe();
  }, []);

  const columns = [
    { 
      label: 'Origem', 
      render: (row) => {
        const icons = { 
          usuario: { icon: User, color: 'text-emerald-400 bg-emerald-500/10' },
          ia: { icon: Bot, color: 'text-blue-400 bg-blue-500/10' },
          sistema: { icon: Server, color: 'text-slate-400 bg-slate-500/10' }
        };
        const config = icons[row.origem] || icons.sistema;
        return (
          <div className={`p-2 rounded-lg inline-flex items-center gap-2 ${config.color}`}>
            <config.icon size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{row.origem}</span>
          </div>
        );
      }
    },
    { label: 'Conteúdo', render: (row) => <p className="text-sm text-slate-300 max-w-xs truncate">{row.conteudo}</p> },
    { label: 'Contato', key: 'whatsapp_numero', className: 'font-mono text-xs text-slate-400' },
    { label: 'Cliente', render: (row) => <p className="text-xs text-slate-500">{row.clientes?.nome || '---'}</p> },
    { label: 'Data/Hora', render: (row) => <p className="text-xs text-slate-600">{formatDateTime(row.created_at)}</p> },
    { 
      label: 'Ações', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionButton icon={Eye} title="Ver Detalhes" color="slate" />
          <ActionButton icon={Copy} title="Copiar" color="slate" />
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader title="Mensagens" subtitle="Acompanhe conversas, envios e respostas da IA">
        <button className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all" onClick={fetchData}>
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all">
          <Download size={20} />
          Exportar CSV
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total" value={stats.total} icon={MessageSquare} color="blue" loading={loading} />
        <StatCard title="IA" value={stats.ia} icon={Bot} color="purple" loading={loading} />
        <StatCard title="Usuários" value={stats.user} icon={User} color="green" loading={loading} />
      </div>

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="Nenhuma mensagem processada" />
    </AdminLayout>
  );
}
