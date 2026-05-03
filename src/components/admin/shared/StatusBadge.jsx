import React from 'react';

export default function StatusBadge({ status, type = 'default' }) {
  const getStyles = () => {
    const s = status?.toLowerCase();
    
    // Status de Conexão / Geral
    if (s === 'conectado' || s === 'ativo' || s === 'sucesso' || s === 'success') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s === 'desconectado' || s === 'inativo' || s === 'erro' || s === 'error' || s === 'falha') {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    if (s === 'suspenso' || s === 'warning' || s === 'alerta' || s === 'aguardando') {
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    }
    if (s === 'ia') {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
    
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
      {status || '---'}
    </span>
  );
}
