import React from 'react';

const statusMap = {
  aberto: { label: 'Aberto', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  em_analise: { label: 'Em Análise', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  resolvido: { label: 'Resolvido', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejeitado: { label: 'Rejeitado', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
};

export default function BugStatusBadge({ status }) {
  const config = statusMap[status] || statusMap.aberto;
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
      {config.label}
    </span>
  );
}
