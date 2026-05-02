import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar,
  MessageSquare,
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import ClienteStatusBadge from './ClienteStatusBadge';
import { formatDate } from '../../../utils/date';
import Skeleton from '../Skeleton';

export default function ClientesTable({ clients, loading, onDetails, onEdit, onDelete, onToggleStatus, onApprove, onReject }) {
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-48 h-4 rounded-lg" />
                <Skeleton className="w-32 h-3 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="glass-card border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Database size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Nenhum cliente encontrado</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">Tente ajustar seus filtros ou cadastre um novo cliente no sistema.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-slate-800 rounded-2xl p-5 bg-slate-900/40 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {client.nome.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">{client.nome} {client.sobrenome}</h4>
                  <p className="text-xs text-slate-500">{client.email}</p>
                </div>
              </div>
              <ClienteStatusBadge status={client.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50 mb-4">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Plano</p>
                <p className="text-xs font-bold text-blue-400 uppercase">{client.planos?.nome || 'S/ PLANO'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Vencimento</p>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <Calendar size={12} className="text-slate-500" />
                  {client.plano_vencimento ? formatDate(client.plano_vencimento) : 'S/ Data'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${client.instancias?.[0]?.conectado ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {client.instancias?.[0]?.conectado ? 'Online' : 'Offline'}
                 </span>
              </div>
              
              <div className="flex items-center gap-2">
                {client.status === 'pending' ? (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => onApprove(client)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      APROVAR
                    </button>
                    <button 
                      onClick={() => onReject(client)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                    >
                      RECUSAR
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => onDetails(client)}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 active:scale-95 transition-transform"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(client)}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 active:scale-95 transition-transform"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(client.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 active:scale-95 transition-transform"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block glass-card border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plano / Vencimento</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">WhatsApp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {clients.map((client) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 font-bold group-hover:border-blue-500/30 transition-all text-lg shadow-inner">
                          {client.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{client.nome} {client.sobrenome}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-wider px-2 py-0.5 bg-slate-800 rounded-md w-fit">
                          {client.planos?.nome || client.plano_nome || 'S/ PLANO'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                          <Calendar size={12} className="text-blue-500" />
                          {client.plano_vencimento ? formatDate(client.plano_vencimento) : 'S/ VENCIMENTO'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <ClienteStatusBadge status={client.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20 ${client.instancias?.[0]?.conectado ? 'bg-emerald-500 ring-emerald-500' : 'bg-slate-700 ring-slate-700'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${client.instancias?.[0]?.conectado ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {client.instancias?.[0]?.conectado ? 'CONECTADO' : 'OFFLINE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        {client.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => onApprove(client)}
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black transition-all shadow-lg shadow-emerald-500/20"
                            >
                              APROVAR
                            </button>
                            <button 
                              onClick={() => onReject(client)}
                              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-black transition-all shadow-lg shadow-rose-500/20"
                            >
                              RECUSAR
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => onDetails(client)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 transition-all"
                              title="Ver Detalhes"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => onEdit(client)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-400 transition-all"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => onToggleStatus(client)}
                              className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 transition-all ${
                                client.status === 'ativo' 
                                  ? 'hover:bg-amber-600/20 hover:text-amber-400 text-slate-400' 
                                  : 'hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-400'
                              }`}
                              title={client.status === 'ativo' ? 'Bloquear' : 'Desbloquear'}
                            >
                              {client.status === 'ativo' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                            </button>
                            <button 
                              onClick={() => onDelete(client.id)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-all"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
