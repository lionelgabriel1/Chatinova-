import React from 'react';
import { Database } from 'lucide-react';

export default function EmptyState({ message = "Nenhum dado encontrado", icon: Icon = Database }) {
  return (
    <div className="glass-card border border-slate-800 rounded-2xl p-16 text-center">
      <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-500">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
      <p className="text-slate-500 max-w-xs mx-auto">Tente ajustar seus filtros ou aguarde novas atividades no sistema.</p>
    </div>
  );
}
