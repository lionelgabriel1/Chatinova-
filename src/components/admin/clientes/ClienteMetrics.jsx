import React from 'react';
import MetricCard from '../MetricCard';
import { Users, UserCheck, AlertCircle, MessageSquare, Zap, Clock } from 'lucide-react';

export default function ClienteMetrics({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      <MetricCard 
        title="Total" 
        value={stats.total} 
        icon={Users} 
        color="blue"
        loading={loading}
      />
      <MetricCard 
        title="Ativos" 
        value={stats.ativos} 
        icon={UserCheck} 
        color="emerald"
        loading={loading}
      />
      <MetricCard 
        title="Pendentes" 
        value={stats.pendentes} 
        icon={Clock} 
        color="orange"
        loading={loading}
      />
      <MetricCard 
        title="Suspensos" 
        value={stats.suspensos} 
        icon={AlertCircle} 
        color="red"
        loading={loading}
      />
      <MetricCard 
        title="Vencendo" 
        value={stats.vencendo} 
        icon={Zap} 
        color="purple"
        loading={loading}
      />
      <MetricCard 
        title="Msg Hoje" 
        value={stats.mensagensHoje} 
        icon={MessageSquare} 
        color="blue"
        loading={loading}
      />
    </div>
  );
}
