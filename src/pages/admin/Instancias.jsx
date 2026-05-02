import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import StatCard from '../../components/admin/shared/StatCard';
import DataTable from '../../components/admin/shared/DataTable';
import StatusBadge from '../../components/admin/shared/StatusBadge';
import ActionButton from '../../components/admin/shared/ActionButton';
import { Database, RefreshCw, Zap, Power, QrCode, Trash2, Smartphone } from 'lucide-react';
import { instanciasService } from '../../services/instanciasService';
import { evolutionService } from '../../services/evolutionService';
import { adminService } from '../../services/adminService';
import { formatDateTime } from '../../utils/date';
import { supabase } from '../../services/supabase';
import { useToast } from '../../hooks/useToast';

export default function Instancias() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, connected: 0, disconnected: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [list, metrics] = await Promise.all([
        instanciasService.getAll(),
        instanciasService.getStats()
      ]);
      setData(list);
      setStats(metrics);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar instâncias do banco.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Usar o novo serviço de admin (backend real sync)
      await adminService.syncInstances();
      toast.success('Sincronização com Evolution GO concluída!');
      await fetchData();
    } catch (error) {
      toast.error('Falha ao sincronizar com Evolution GO.');
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleCheckStatus = async (instanceName) => {
    setCheckingStatus(prev => ({ ...prev, [instanceName]: true }));
    try {
      const result = await adminService.getInstanceStatus(instanceName);
      toast.info(`Instância ${instanceName} está ${result.status.toUpperCase()}`);
      await fetchData();
    } catch (error) {
      toast.error(`Erro ao verificar status de ${instanceName}`);
    } finally {
      setCheckingStatus(prev => ({ ...prev, [instanceName]: false }));
    }
  };

  const handleTestConnection = async (instanceName) => {
    const number = prompt('Digite o número para teste (com DDD):', '5511999999999');
    if (!number) return;

    try {
      toast.info('Enviando mensagem de teste...');
      await adminService.testWhatsapp(instanceName, number);
      toast.success('Teste enviado com sucesso!');
    } catch (error) {
      toast.error('Falha no teste: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAction = async (action, instanceName) => {
    try {
      setLoading(true);
      if (action === 'restart') await evolutionService.restartInstance(instanceName);
      if (action === 'delete') await evolutionService.deleteInstance(instanceName);
      if (action === 'qrcode') {
        const qr = await evolutionService.getQRCode(instanceName);
        console.log('QR Code:', qr);
        toast.info('QR Code gerado no console (integração visual em breve)');
      }
      toast.success(`Ação ${action} executada com sucesso!`);
      await handleSync(); 
    } catch (error) {
      toast.error(`Erro ao executar ${action}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sincronização Automática ao abrir a página
    handleSync();
    
    const sub = supabase.channel('instancias_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instancias' }, () => fetchData())
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const columns = [
    { 
      label: 'Instância', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${row.conectado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            <Database size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{row.nome_instancia}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{row.status || 'offline'}</p>
          </div>
        </div>
      )
    },
    { label: 'Cliente', render: (row) => <p className="text-sm text-slate-300">{row.clientes?.nome || '---'}</p> },
    { label: 'WhatsApp', key: 'numero_whatsapp', className: 'font-mono text-xs text-slate-400' },
    { label: 'Status', render: (row) => <StatusBadge status={row.conectado ? 'conectado' : 'desconectado'} /> },
    { label: 'Última Sync', render: (row) => <p className="text-xs text-slate-500">{formatDateTime(row.updated_at)}</p> },
    { 
      label: 'Ações', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionButton 
            icon={Smartphone} 
            title="Testar Conexão" 
            color="green" 
            onClick={() => handleTestConnection(row.nome_instancia)} 
          />
          <ActionButton 
            icon={RefreshCw} 
            title="Verificar Status Real" 
            color="blue" 
            loading={checkingStatus[row.nome_instancia]}
            onClick={() => handleCheckStatus(row.nome_instancia)} 
          />
          <ActionButton icon={QrCode} title="Ver QR Code" color="blue" onClick={() => handleAction('qrcode', row.nome_instancia)} />
          <ActionButton icon={Trash2} title="Excluir" color="red" onClick={() => handleAction('delete', row.nome_instancia)} />
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader title="Instâncias WhatsApp" subtitle="Gerenciamento e Sincronização Real-Time com Evolution GO">
        <button 
          className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20 ${syncing ? 'opacity-50' : ''}`} 
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Sincronizando...' : 'Sincronizar Tudo'}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total no Gateway" value={stats.total} icon={Database} color="blue" loading={loading} />
        <StatCard title="Conectadas" value={stats.connected} icon={Zap} color="green" loading={loading} />
        <StatCard title="Desconectadas" value={stats.disconnected} icon={Power} color="orange" loading={loading} />
        <StatCard title="Status Backend" value={syncing ? 'Sincronizando' : 'ONLINE'} icon={RefreshCw} color="purple" loading={loading} />
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        emptyMessage="Nenhuma instância encontrada na Evolution GO. Clique em Sincronizar Tudo." 
        mobileRender={(row) => (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${row.conectado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-white font-black">{row.nome_instancia}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {row.clientes?.nome || 'Sem Proprietário'}
                  </p>
                </div>
              </div>
              <StatusBadge status={row.conectado ? 'conectado' : 'desconectado'} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="text-xs font-mono text-white">{row.numero_whatsapp || '---'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Última Sync</p>
                <p className="text-xs text-slate-400">{formatDateTime(row.updated_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleTestConnection(row.nome_instancia)}
                className="py-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/20"
              >
                <Smartphone size={14} /> Testar
              </button>
              <button 
                onClick={() => handleCheckStatus(row.nome_instancia)}
                className="py-3 bg-blue-500/10 text-blue-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-blue-500/20"
              >
                <RefreshCw size={14} className={checkingStatus[row.nome_instancia] ? 'animate-spin' : ''} /> Status
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAction('qrcode', row.nome_instancia)}
                className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/5"
              >
                <QrCode size={14} /> Ver QR
              </button>
              <button 
                onClick={() => handleAction('delete', row.nome_instancia)}
                className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      />
    </AdminLayout>
  );
}

