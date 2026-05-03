import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  Check,
  X,
  Calendar,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { solicitacoesService } from '../../services/solicitacoesService';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import AprovarClienteModal from '../../components/admin/solicitacoes/AprovarClienteModal';

export default function Solicitacoes() {
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [metrics, setMetrics] = useState({ totalPendentes: 0, aprovadosHoje: 0, reprovadosHoje: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, stats] = await Promise.all([
        solicitacoesService.getPendingClients(),
        solicitacoesService.getSolicitacoesMetrics()
      ]);
      setSolicitacoes(data);
      setMetrics(stats);
    } catch (error) {
      toast.error('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (clienteId, planoId, dias) => {
    try {
      await solicitacoesService.approveClient(clienteId, planoId, dias);
      toast.success('Cliente aprovado com sucesso!');
      setIsApproveModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao aprovar cliente: ' + error.message);
    }
  };

  const handleReject = async (clienteId) => {
    if (!confirm('Tem certeza que deseja reprovar este cadastro? Todos os dados serão removidos.')) return;
    
    try {
      await solicitacoesService.rejectClient(clienteId);
      toast.success('Cadastro reprovado e removido.');
      loadData();
    } catch (error) {
      toast.error('Erro ao reprovar cliente: ' + error.message);
    }
  };

  const filteredSolicitacoes = solicitacoes.filter(s => 
    s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cpf?.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <PageHeader 
        title="Solicitações de Cadastro" 
        subtitle="Gerencie novos usuários aguardando aprovação no sistema"
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Pendentes', value: metrics.totalPendentes, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Aprovados Hoje', value: metrics.aprovadosHoje, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Reprovados Hoje', value: metrics.reprovadosHoje, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-6 border border-white/5 rounded-3xl flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{item.label}</p>
              <h3 className="text-2xl font-black text-white">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou CPF..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-slate-800 text-white rounded-2xl flex items-center gap-2 hover:bg-slate-700 transition-all border border-white/5">
          <Filter size={18} />
          <span>Filtros</span>
        </button>
      </div>

      {/* Responsive List/Table */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card p-20 border border-white/5 rounded-[2.5rem] text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Carregando solicitações...</p>
          </div>
        ) : filteredSolicitacoes.length === 0 ? (
          <div className="glass-card p-20 border border-white/5 rounded-[2.5rem] text-center">
            <div className="p-4 bg-slate-800/50 rounded-full w-fit mx-auto mb-4 text-slate-600">
              <Users size={32} />
            </div>
            <p className="text-white font-bold text-lg">Nenhuma solicitação pendente</p>
            <p className="text-slate-500">Novos cadastros aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block glass-card border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Documento / Contato</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Cadastro</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSolicitacoes.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20">
                              {s.nome?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-bold">{s.nome} {s.sobrenome}</p>
                              <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                                <Mail size={10} />
                                <span>{s.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                              <User size={12} className="text-slate-600" />
                              <span>CPF: {s.cpf}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                              <Phone size={12} className="text-slate-600" />
                              <span>{s.telefone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-600" />
                            {new Date(s.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                            Pendente
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setSelectedClient(s); setIsApproveModalOpen(true); }}
                              className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                              title="Aprovar"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleReject(s.id)}
                              className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                              title="Reprovar"
                            >
                              <X size={18} />
                            </button>
                            <button 
                              className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-white/5"
                              title="Ver Detalhes"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredSolicitacoes.map((s) => (
                <div key={s.id} className="glass-card p-6 border border-white/5 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg">
                        {s.nome?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-black">{s.nome} {s.sobrenome}</p>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
                          Pendente
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedClient(s); setIsApproveModalOpen(true); }}
                        className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => handleReject(s.id)}
                        className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 py-4 border-y border-white/5">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Mail size={16} className="text-slate-600" />
                      <span className="text-sm">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <User size={16} className="text-slate-600" />
                      <span className="text-sm">CPF: {s.cpf}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Phone size={16} className="text-slate-600" />
                      <span className="text-sm">{s.telefone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={16} className="text-slate-600" />
                      <span className="text-sm">{new Date(s.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <Eye size={16} /> Ver Detalhes Completos
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AprovarClienteModal 
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApprove}
        client={selectedClient}
      />
    </AdminLayout>
  );
}
