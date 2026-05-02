import React from 'react';
import StatCard from '../shared/StatCard';
import { AlertCircle, Eye, CheckCircle, XCircle, Zap } from 'lucide-react';

export default function BugMetrics({ bugs, loading }) {
  const stats = {
    total: bugs.length,
    abertos: bugs.filter(b => b.status === 'aberto').length,
    em_analise: bugs.filter(b => b.status === 'em_analise').length,
    resolvidos: bugs.filter(b => b.status === 'resolvido').length,
    urgentes: bugs.filter(b => b.prioridade === 'urgente' && b.status !== 'resolvido').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard title="Total" value={stats.total} icon={AlertCircle} color="blue" loading={loading} />
      <StatCard title="Abertos" value={stats.abertos} icon={Eye} color="yellow" loading={loading} />
      <StatCard title="Em Análise" value={stats.em_analise} icon={Zap} color="purple" loading={loading} />
      <StatCard title="Resolvidos" value={stats.resolvidos} icon={CheckCircle} color="green" loading={loading} />
      <StatCard title="Urgentes" value={stats.urgentes} icon={AlertCircle} color="red" loading={loading} />
    </div>
  );
}
