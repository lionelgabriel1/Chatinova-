import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  Bell
} from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientDashboardService } from '../../services/clientDashboardService';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';

const MetricCard = ({ title, value, icon: Icon, color, trend, loading }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
          <TrendingUp size={12} />
          {trend}%
        </div>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
    {loading ? (
      <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg"></div>
    ) : (
      <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
    )}
  </motion.div>
);

export default function DashboardCliente() {
  const toast = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const cliente = clientAuthService.getClienteLogado();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clientDashboardService.getMetrics(cliente.id);
      setMetrics(data);
    } catch (error) {
      toast.error('Falha ao carregar métricas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ClienteLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">Visão geral do seu assistente de IA.</p>
        </div>
        
        <div className="flex items-center gap-3 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Conta Ativa</span>
          </div>
          <button className="p-2 text-slate-500 hover:text-white transition-colors">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          title="Mensagens Hoje" 
          value={metrics?.mensagens?.hoje || 0} 
          icon={MessageSquare} 
          color="blue" 
          trend={12} 
          loading={loading} 
        />
        <MetricCard 
          title="Interações Mês" 
          value={metrics?.mensagens?.mes || 0} 
          icon={Zap} 
          color="purple" 
          loading={loading} 
        />
        <MetricCard 
          title="WhatsApp Status" 
          value={metrics?.whatsapp?.conectado ? 'Online' : 'Offline'} 
          icon={ShieldCheck} 
          color={metrics?.whatsapp?.conectado ? 'emerald' : 'rose'} 
          loading={loading} 
        />
        <MetricCard 
          title="Notificações" 
          value={metrics?.notificacoes || 0} 
          icon={Bell} 
          color="orange" 
          loading={loading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-white uppercase tracking-widest text-sm">Desempenho da IA</h3>
            <select className="bg-slate-800 text-xs font-bold text-white border-none rounded-xl px-4 py-2 focus:ring-2 ring-purple-500/20">
              <option>Últimos 7 dias</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-purple-600/20 to-purple-500 rounded-t-xl relative group"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h * 12} msgs
                  </div>
                </motion.div>
                <span className="text-[10px] font-black text-slate-600 uppercase">Dia {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <Zap size={32} />
              <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Premium</div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">Plano Advanced</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">Seu limite de mensagens é ilimitado até o próximo vencimento.</p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-200" />
                <span className="text-xs font-bold">Vencimento</span>
              </div>
              <span className="text-xs font-black">15 Mai, 2026</span>
            </div>
            <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all">
              Gerenciar Assinatura
            </button>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </ClienteLayout>
  );
}
