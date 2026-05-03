import React from 'react';

const priorityMap = {
  baixa: { label: 'Baixa', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  media: { label: 'Média', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  alta: { label: 'Alta', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  urgente: { label: 'Urgente', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
};

export default function BugPriorityBadge({ prioridade }) {
  const config = priorityMap[prioridade] || priorityMap.media;
  
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${config.color}`}>
      {config.label}
    </span>
  );
}
