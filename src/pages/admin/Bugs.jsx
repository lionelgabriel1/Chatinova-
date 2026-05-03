import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import BugMetrics from '../../components/admin/bugs/BugMetrics';
import BugsTable from '../../components/admin/bugs/BugsTable';
import BugDetailsDrawer from '../../components/admin/bugs/BugDetailsDrawer';
import { bugReportService } from '../../services/bugReportService';
import { useToast } from '../../hooks/useToast';
import { Filter } from 'lucide-react';

export default function BugsAdmin() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBug, setSelectedBug] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'todos', prioridade: 'todas' });
  const toast = useToast();

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const data = await bugReportService.getAllBugReports(filters);
      setBugs(data);
    } catch (error) {
      toast.error('Erro ao carregar bugs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
    const sub = bugReportService.subscribeBugs(() => fetchBugs());
    return () => sub.unsubscribe();
  }, [filters]);

  const handleOpenBug = (bug) => {
    setSelectedBug(bug);
    setIsDrawerOpen(true);
  };

  const handleResolveBug = async (id) => {
    try {
      await bugReportService.updateBugStatus(id, 'resolvido');
      toast.success('Bug marcado como resolvido!');
      fetchBugs();
    } catch (e) {
      toast.error('Erro ao atualizar status.');
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Central de Bugs" subtitle="Gerencie e resolva os problemas reportados pelos clientes.">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
            <Filter size={16} className="text-slate-500" />
            <select 
              className="bg-transparent text-sm font-bold text-slate-300 outline-none"
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="todos">Todos Status</option>
              <option value="aberto">Abertos</option>
              <option value="em_analise">Em Análise</option>
              <option value="resolvido">Resolvidos</option>
              <option value="rejeitado">Rejeitados</option>
            </select>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-8">
        <BugMetrics bugs={bugs} loading={loading} />
        
        <div className="glass-card border border-slate-800 rounded-3xl overflow-hidden">
          <BugsTable 
            bugs={bugs} 
            loading={loading} 
            onSelect={handleOpenBug} 
            onResolve={handleResolveBug} 
          />
        </div>
      </div>

      <BugDetailsDrawer 
        bug={selectedBug} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onUpdate={fetchBugs}
      />
    </AdminLayout>
  );
}
