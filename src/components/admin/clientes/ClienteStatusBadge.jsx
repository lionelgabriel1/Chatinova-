import React from 'react';

const statusMap = {
  ativo: { label: 'Ativo', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  bloqueado: { label: 'Bloqueado', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  suspenso: { label: 'Expirado', classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  pending: { label: 'Pendente', classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  reprovado: { label: 'Reprovado', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export default function ClienteStatusBadge({ status }) {
  const config = statusMap[status] || { label: status, classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${config.classes}`}>
      {config.label}
    </span>
  );
}
