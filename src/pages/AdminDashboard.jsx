import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import MetricCard from '../components/admin/MetricCard';
import { AccessChart, MessagesChart } from '../components/admin/Charts';
import RealtimeAccess from '../components/admin/RealtimeAccess';
import RecentClients from '../components/admin/RecentClients';
import InstancesStatus from '../components/admin/InstancesStatus';
import EnterpriseTopBar from '../components/admin/EnterpriseTopBar';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Zap,
  ArrowUpRight,
  Database,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';
import { supabase } from '../services/supabase';
import { useToast } from '../hooks/useToast';
import { logService } from '../services/logService';

export default function AdminDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalMessages: 0,
    activeInstances: 0,
    systemLoad: '0%'
  });
  const [chartData, setChartData] = useState({
    access: [],
    messages: []
  });
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  const isFetching = React.useRef(false);

  const fetchData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const [clientsRes, messagesRes, activeInstRes, dayMessagesRes] = await Promise.all([
        supabase.from('clientes').select('*', { count: 'exact', head: true }),
        supabase.from('mensagens').select('*', { count: 'exact', head: true }),
        supabase.from('instancias').select('*', { count: 'exact', head: true }).eq('conectado', true),
        supabase.from('mensagens')
          .select('*', { count: 'exact', head: true })
          .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const loadCalc = dayMessagesRes.count ? Math.min(Math.round((dayMessagesRes.count / 1000) * 100), 100) : 0;

      setStats({
        totalClients: clientsRes.count || 0,
        totalMessages: messagesRes.count || 0,
        activeInstances: activeInstRes.count || 0,
        systemLoad: `${loadCalc}%`
      });

      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('pt-BR', { weekday: 'short' });
      }).reverse();

      const { data: accessData } = await supabase
        .from('acessos_site')
        .select('created_at')
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: msgData } = await supabase
        .from('mensagens')
        .select('created_at')
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const groupData = last7Days.map(day => {
        const countAccess = accessData?.filter(a => 
          new Date(a.created_at).toLocaleDateString('pt-BR', { weekday: 'short' }) === day
        ).length || 0;
        
        const countMsg = msgData?.filter(m => 
          new Date(m.created_at).toLocaleDateString('pt-BR', { weekday: 'short' }) === day
        ).length || 0;

        return { name: day, acessos: countAccess, mensagens: countMsg };
      });

      setChartData({
        access: groupData.some(d => d.acessos > 0) ? groupData : [],
        messages: groupData.some(d => d.mensagens > 0) ? groupData : []
      });

    } catch (error) {
      console.error('Erro dashboard:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchData();

    // Monitorar Modo Manutenção
    const loadMaintenance = async () => {
      const status = await maintenanceService.getStatus();
      setMaintenanceEnabled(status.enabled);
    };
    loadMaintenance();

    const subscription = maintenanceService.subscribeStatus((status) => {
      setMaintenanceEnabled(status.enabled);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        <EnterpriseTopBar />

        {/* Aviso Modo Manutenção */}
        {maintenanceEnabled && (
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-[2px] opacity-30"></div>
            <div className="relative bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/30">
                  <AlertTriangle size={28} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Modo Manutenção Ativo</h3>
                  <p className="text-slate-400 text-sm">O sistema está bloqueado para todos os usuários no momento.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
                <a 
                  href="/admin/configuracoes"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Configurar
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard 
            title="Total de Clientes" 
            value={stats.totalClients} 
            icon={Users} 
            color="blue"
            loading={loading}
          />
          <MetricCard 
            title="Mensagens Enviadas" 
            value={stats.totalMessages} 
            icon={MessageSquare} 
            color="purple"
            loading={loading}
          />
          <MetricCard 
            title="Instâncias Ativas" 
            value={stats.activeInstances} 
            icon={Zap} 
            color="emerald"
            loading={loading}
          />
          <MetricCard 
            title="Carga do Sistema" 
            value={stats.systemLoad} 
            icon={Activity} 
            color="orange"
            loading={loading}
          />
        </div>

        {/* Middle Section: Charts & Live Access */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 overflow-hidden">
            <AccessChart data={chartData.access} loading={loading} />
          </div>
          <div className="w-full">
            <RealtimeAccess />
          </div>
        </div>

        {/* Bottom Section: Clients & Instances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="overflow-x-hidden">
            <RecentClients />
          </div>
          <div className="overflow-x-hidden">
            <InstancesStatus />
          </div>
        </div>

        {/* Footer Charts & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="overflow-hidden">
              <MessagesChart data={chartData.messages} loading={loading} />
            </div>
            <div className="glass-card p-6 md:p-8 border border-slate-800 rounded-3xl bg-gradient-to-br from-blue-600/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Infraestrutura</h3>
                    <p className="text-slate-400 text-sm md:max-w-md">Dados sincronizados em tempo real com seu cluster Supabase.</p>
                    <button 
                      onClick={fetchData}
                      className="mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all w-full md:w-fit shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        Atualizar Dados
                        <ArrowUpRight size={18} />
                    </button>
                </div>
                <div className="hidden md:flex p-6 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20 animate-pulse-slow">
                    <Database size={48} />
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
