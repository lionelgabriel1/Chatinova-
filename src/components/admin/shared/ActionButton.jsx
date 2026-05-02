import React from 'react';

export default function ActionButton({ icon: Icon, onClick, title, color = 'slate' }) {
  const colors = {
    slate: 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700',
    blue: 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300',
    red: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300',
    green: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300',
  };

  return (
    <button 
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all border border-transparent hover:border-white/5 ${colors[color]}`}
    >
      <Icon size={16} />
    </button>
  );
}
