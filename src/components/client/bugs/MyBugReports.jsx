import React from 'react';
import { formatDateTime } from '../../../utils/date';
import BugStatusBadge from './BugStatusBadge';
import { MessageCircle, Paperclip, ChevronRight } from 'lucide-react';

export default function MyBugReports({ bugs, onSelect }) {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="glass-card p-12 border border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-4">
        <MessageCircle size={48} className="opacity-20" />
        <p className="font-bold text-sm tracking-tight">Você ainda não reportou nenhum bug.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <button
          key={bug.id}
          onClick={() => onSelect(bug)}
          className="w-full glass-card p-5 border border-white/5 rounded-2xl hover:border-white/10 transition-all group flex items-center justify-between text-left"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              bug.prioridade === 'urgente' ? 'bg-red-500/10 text-red-400' :
              bug.prioridade === 'alta' ? 'bg-orange-500/10 text-orange-400' :
              bug.prioridade === 'baixa' ? 'bg-blue-500/10 text-blue-400' :
              'bg-yellow-500/10 text-yellow-400'
            }`}>
              <BugStatusBadge status={bug.status} />
            </div>
            
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">{bug.titulo}</h4>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{formatDateTime(bug.created_at)}</span>
                {bug.anexo_url && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 font-black uppercase tracking-widest">
                    <Paperclip size={10} />
                    Anexo
                  </div>
                )}
              </div>
            </div>
          </div>

          <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
    </div>
  );
}
