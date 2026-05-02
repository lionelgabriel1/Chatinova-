import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function ClienteFilters({ filters, setFilters, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50">
      <div className="flex-1 min-w-[300px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome, email ou CPF..."
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <select
          className="bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-300 outline-none focus:border-blue-500/50 transition-all"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="suspenso">Suspensos</option>
          <option value="bloqueado">Bloqueados</option>
        </select>

        <select
          className="bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-300 outline-none focus:border-blue-500/50 transition-all"
          value={filters.plano}
          onChange={(e) => setFilters({ ...filters, plano: e.target.value })}
        >
          <option value="">Todos os Planos</option>
          <option value="basico">Básico</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <button
          onClick={onClear}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          title="Limpar Filtros"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
