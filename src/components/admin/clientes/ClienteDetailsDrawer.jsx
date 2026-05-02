import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Calendar, 
  Shield, 
  Database, 
  Activity, 
  Bell, 
  MessageSquare,
  Clock,
  History
} from 'lucide-react';
import { formatDate, formatDateTime, timeAgo } from '../../../utils/date';
import ClienteStatusBadge from './ClienteStatusBadge';

export default function ClienteDetailsDrawer({ isOpen, onClose, client }) {
  if (!isOpen || !client) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#020617] border-l border-slate-800 shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-10">
            <h2 className="text-xl font-bold text-white">Detalhes do Cliente</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8 pb-12">
            {/* Perfil */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-blue-600/20 border border-white/10">
                {client.nome.charAt(0)}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{client.nome} {client.sobrenome}</h3>
                <p className="text-slate-500 text-sm mt-1">{client.email}</p>
                <div className="mt-4">
                   <ClienteStatusBadge status={client.status} />
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={12} className="text-blue-500" />
                Dados Pessoais
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Hash size={16} className="text-slate-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CPF</p>
                      <p className="text-sm text-slate-200">{client.cpf || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telefone</p>
                      <p className="text-sm text-slate-200">{client.telefone || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano e Assinatura */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-blue-500" />
                Plano e Assinatura
              </h4>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-lg font-bold text-white uppercase">{client.planos?.nome || client.plano_nome || 'S/ PLANO'}</span>
                   <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-lg">
                      <Clock size={14} />
                      Vence {client.plano_vencimento ? formatDate(client.plano_vencimento) : 'S/ Vencimento'}
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Desde</span>
                      <span className="text-slate-200 font-medium">{formatDate(client.created_at)}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Último Login</span>
                      <span className="text-slate-200 font-medium">{timeAgo(client.ultimo_login)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={12} className="text-blue-500" />
                WhatsApp (Instância)
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                {client.instancias?.[0] ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${client.instancias[0].conectado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Database size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{client.instancias[0].nome_instancia}</p>
                        <p className="text-xs text-slate-500">{client.instancias[0].whatsapp_numero || 'Sem número'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className={`text-[10px] font-bold ${client.instancias[0].conectado ? 'text-emerald-400' : 'text-slate-500'}`}>
                         {client.instancias[0].conectado ? 'CONECTADO' : 'DESCONECTADO'}
                       </span>
                       <p className="text-[10px] text-slate-600">há {timeAgo(client.instancias[0].data_conexao)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-2">Nenhuma instância configurada.</p>
                )}
              </div>
            </div>

            {/* Eventos Recentes */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History size={12} className="text-blue-500" />
                Eventos Recentes
              </h4>
              <div className="space-y-3">
                {client.eventos_cliente?.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/30">
                    <div className="mt-1">
                       <Activity size={12} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{event.descricao}</p>
                      <p className="text-[10px] text-slate-500">{timeAgo(event.created_at)}</p>
                    </div>
                  </div>
                ))}
                {(!client.eventos_cliente || client.eventos_cliente.length === 0) && (
                   <p className="text-xs text-slate-600 text-center py-2">Sem eventos registrados.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
