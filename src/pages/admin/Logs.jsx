import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import StatCard from '../../components/admin/shared/StatCard';
import DataTable from '../../components/admin/shared/DataTable';
import { Terminal, RefreshCw, AlertTriangle, Info, CheckCircle, Bug, Filter, Search, User, Globe, MessageSquare, Zap } from 'lucide-react';
import { logsService } from '../../services/logsService';
import { formatDateTime } from '../../utils/date';
import { motion, AnimatePresence } from 'framer-motion';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ totalHoje: 0, errosHoje: 0, loginsHoje: 0, msgsHoje: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ tipo: '', nivel: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [list, stats] = await Promise.all([
        logsService.getLogs(filters),
        logsService.getLogsMetrics()
      ]);
      setLogs(list);
      setMetrics(stats);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const sub = logsService.subscribeLogs((newLog) => {
      setLogs(prev => [newLog, ...prev].slice(0, 100));
      // Atualizar métricas se for de hoje
      fetchData();
    });

    return () => sub.unsubscribe();
  }, [filters]);

  const filteredLogs = logs.filter(log => 
    log.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.usuario_nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      label: 'Horário', 
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-xs font-bold text-slate-300">{new Date(row.created_at).toLocaleTimeString()}</p>
          <p className="text-[9px] text-slate-500 font-medium">{new Date(row.created_at).toLocaleDateString()}</p>
        </div>
      )
    },
    { 
      label: 'Nível', 
      render: (row) => {
        const colors = {
          info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          error: 'bg-red-500/10 text-red-400 border-red-500/20',
          success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
        const Icons = { info: Info, warning: AlertTriangle, error: Bug, success: CheckCircle };
        const Icon = Icons[row.nivel] || Info;

        return (
          <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${colors[row.nivel] || colors.info}`}>
            <Icon size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">{row.nivel}</span>
          </div>
        );
      }
    },
    { 
      label: 'Tipo / Evento', 
      render: (row) => (
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">{row.tipo}</p>
          <p className="text-sm font-black text-white leading-tight">{row.titulo}</p>
        </div>
      )
    },
    { 
      label: 'Usuário', 
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.usuario_nome ? (
            <>
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold border border-white/5">
                {row.usuario_nome.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">{row.usuario_nome}</p>
                <p className="text-[9px] text-slate-500">{row.usuario_tipo}</p>
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-600">Sistema</span>
          )}
        </div>
      )
    },
    { 
      label: 'Descrição', 
      render: (row) => (
        <p className="text-xs text-slate-400 max-w-md line-clamp-1">{row.descricao}</p>
      )
    },
    { 
      label: 'Rota/Aba', 
      render: (row) => (
        <div>
          <p className="text-[10px] font-mono text-indigo-400">{row.rota || '—'}</p>
          <p className="text-[9px] text-slate-600 truncate max-w-[100px]">{row.aba}</p>
        </div>
      )
    },
    { 
      label: 'Ações', 
      render: (row) => (
        <button 
          onClick={() => console.log(row.metadata)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
          title="Ver Detalhes (JSON)"
        >
          <Terminal size={14} />
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader title="Logs do Sistema" subtitle="Rastreabilidade total e auditoria em tempo real">
        <button 
          className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all" 
          onClick={fetchData}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Hoje" value={metrics.totalHoje} icon={Terminal} color="blue" loading={loading} />
        <StatCard title="Erros Hoje" value={metrics.errosHoje} icon={Bug} color="red" loading={loading} />
        <StatCard title="Logins Hoje" value={metrics.loginsHoje} icon={User} color="purple" loading={loading} />
        <StatCard title="Mensagens Hoje" value={metrics.msgsHoje} icon={MessageSquare} color="green" loading={loading} />
      </div>

      <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-6 backdrop-blur-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <select 
            value={filters.nivel}
            onChange={(e) => setFilters(f => ({ ...f, nivel: e.target.value }))}
            className="bg-slate-950 border border-white/10 rounded-2xl py-3 px-4 text-slate-300 focus:outline-none"
          >
            <option value="">Todos Níveis</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>

          <select 
            value={filters.tipo}
            onChange={(e) => setFilters(f => ({ ...f, tipo: e.target.value }))}
            className="bg-slate-950 border border-white/10 rounded-2xl py-3 px-4 text-slate-300 focus:outline-none"
          >
            <option value="">Todos Tipos</option>
            <option value="navegacao">Navegação</option>
            <option value="login">Login</option>
            <option value="mensagem">Mensagem</option>
            <option value="aviso">Aviso</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-white tracking-tighter">Eventos do Sistema</h3>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Monitorando em Tempo Real</p>
        </div>
        <DataTable columns={columns} data={filteredLogs} loading={loading} emptyMessage="Nenhum log operacional registrado" />
      </div>
    </AdminLayout>
  );
}
