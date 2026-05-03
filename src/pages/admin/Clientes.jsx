import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ClienteMetrics from '../../components/admin/clientes/ClienteMetrics';
import ClienteFilters from '../../components/admin/clientes/ClienteFilters';
import ClientesTable from '../../components/admin/clientes/ClientesTable';
import ClienteFormModal from '../../components/admin/clientes/ClienteFormModal';
import ClienteDetailsDrawer from '../../components/admin/clientes/ClienteDetailsDrawer';
import ClienteApprovalModal from '../../components/admin/clientes/ClienteApprovalModal';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { clientesService } from '../../services/clientesService';
import { supabase } from '../../services/supabase';
import { useToast } from '../../hooks/useToast';
import { isExpiringSoon } from '../../utils/date';

export default function Clientes() {
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    suspensos: 0,
    pendentes: 0,
    vencendo: 0,
    mensagensHoje: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    plano: ''
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientesService.getAll();
      setClients(data);
      
      setStats({
        total: data.length,
        ativos: data.filter(c => c.status === 'ativo').length,
        suspensos: data.filter(c => c.status === 'suspenso').length,
        pendentes: data.filter(c => c.status === 'pending').length,
        vencendo: data.filter(c => isExpiringSoon(c.data_vencimento)).length,
        mensagensHoje: 0 // Simplificado
      });

    } catch (error) {
      toast.error('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    let result = [...clients];
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c => 
        c.nome.toLowerCase().includes(search) || 
        c.email.toLowerCase().includes(search)
      );
    }
    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.plano) result = result.filter(c => (c.planos?.nome || '').toLowerCase().includes(filters.plano.toLowerCase()));
    setFilteredClients(result);
  }, [filters, clients]);

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === 'ativo' ? 'suspenso' : 'ativo';
    try {
      await clientesService.setStatus(client.id, newStatus);
      toast.info(`Status atualizado para ${newStatus.toUpperCase()}`);
      fetchClients();
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir cliente permanentemente?')) {
      try {
        await clientesService.delete(id);
        toast.success('Cliente removido.');
        fetchClients();
      } catch (error) {
        toast.error('Erro ao excluir.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Gestão de Clientes</h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">Controle de acessos e assinaturas.</p>
          </div>
          <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`p-3.5 rounded-2xl border transition-all ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              title="Filtros"
            >
              <Filter size={20} />
            </button>
            <button onClick={fetchClients} className="p-3.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => { setSelectedClient(null); setModalOpen(true); }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Plus size={20} /> <span className="sm:inline">Novo</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid Responsive */}
        <ClienteMetrics stats={stats} loading={loading} />

        {/* Filters Responsive */}
        {(showFilters || window.innerWidth >= 768) && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ClienteFilters 
              filters={filters} 
              setFilters={setFilters} 
              onClear={() => setFilters({ search: '', status: '', plano: '' })} 
            />
          </div>
        )}

        {/* Table/Card View Responsive */}
        <div className="mb-8">
          <ClientesTable 
            clients={filteredClients} 
            loading={loading}
            onDetails={(client) => { setSelectedClient(client); setDrawerOpen(true); }}
            onEdit={(client) => { setSelectedClient(client); setModalOpen(true); }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onApprove={(client) => { setSelectedClient(client); setApprovalModalOpen(true); }}
            onReject={(client) => { /* logic */ }}
          />
        </div>
      </div>

      <ClienteFormModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setSelectedClient(null); }}
        onSubmit={() => fetchClients()}
        initialData={selectedClient}
      />

      <ClienteDetailsDrawer 
        isOpen={drawerOpen} 
        onClose={() => { setDrawerOpen(false); setSelectedClient(null); }}
        client={selectedClient}
      />

      <ClienteApprovalModal 
        isOpen={approvalModalOpen}
        onClose={() => { setApprovalModalOpen(false); setSelectedClient(null); }}
        onConfirm={() => fetchClients()}
        client={selectedClient}
      />
    </AdminLayout>
  );
}
