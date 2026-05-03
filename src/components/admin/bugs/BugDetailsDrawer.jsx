import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Download, User, Globe, AlertCircle } from 'lucide-react';
import BugStatusBadge from './BugStatusBadge';
import BugPriorityBadge from './BugPriorityBadge';
import { bugReportService } from '../../../services/bugReportService';
import { formatDateTime } from '../../../utils/date';
import { useToast } from '../../../hooks/useToast';

export default function BugDetailsDrawer({ bug, isOpen, onClose, onUpdate }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (bug && isOpen) {
      fetchResponses();
      const sub = bugReportService.subscribeBugResponses(bug.id, () => fetchResponses());
      return () => sub.unsubscribe();
    }
  }, [bug?.id, isOpen]);

  const fetchResponses = async () => {
    try {
      const data = await bugReportService.getBugById(bug.id);
      setResponses(data.respostas || []);
    } catch (e) {}
  };

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    setLoading(true);
    try {
      await bugReportService.addBugResponse(bug.id, {
        remetente_tipo: 'admin',
        mensagem: response
      });
      setResponse('');
      toast.success('Resposta enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar resposta.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await bugReportService.updateBugStatus(bug.id, newStatus);
      toast.success(`Status atualizado para ${newStatus}`);
      onUpdate();
    } catch (e) {
      toast.error('Erro ao atualizar status.');
    }
  };

  if (!bug) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-white/5 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${
                  bug.prioridade === 'urgente' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">{bug.titulo}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <BugStatusBadge status={bug.status} />
                    <BugPriorityBadge prioridade={bug.prioridade} />
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Cliente Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <User size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cliente</span>
                  </div>
                  <p className="text-sm font-bold text-white">{bug.clientes?.nome}</p>
                  <p className="text-xs text-slate-400">{bug.clientes?.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Globe size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Página</span>
                  </div>
                  <p className="text-sm font-bold text-white">{bug.pagina || '---'}</p>
                  <p className="text-xs text-slate-400">{formatDateTime(bug.created_at)}</p>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descrição do Problema</h4>
                <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 text-slate-300 text-sm leading-relaxed">
                  {bug.descricao}
                </div>
              </div>

              {/* Anexo */}
              {bug.anexo_url && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evidência Anexada</h4>
                  <div className="relative group rounded-3xl overflow-hidden border border-white/5 bg-slate-800 aspect-video flex items-center justify-center">
                    {bug.anexo_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                      <img src={bug.anexo_url} alt="Evidência" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <Paperclip size={48} />
                        <span className="text-xs font-bold uppercase">{bug.anexo_nome}</span>
                      </div>
                    )}
                    <a 
                      href={bug.anexo_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 text-white font-bold"
                    >
                      <Download size={20} />
                      Visualizar Arquivo
                    </a>
                  </div>
                </div>
              )}

              {/* Histórico / Respostas */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Histórico de Atendimento</h4>
                <div className="space-y-4">
                  {responses.map((resp) => (
                    <div key={resp.id} className={`flex ${resp.remetente_tipo === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        resp.remetente_tipo === 'admin' 
                        ? 'bg-blue-600/20 text-blue-200 border border-blue-500/20 rounded-tr-none' 
                        : 'bg-slate-800 text-slate-300 border border-white/5 rounded-tl-none'
                      }`}>
                        <p className="text-sm">{resp.mensagem}</p>
                        <span className="text-[9px] opacity-50 mt-2 block font-mono">
                          {formatDateTime(resp.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions / Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-900/50 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['aberto', 'em_analise', 'resolvido', 'rejeitado'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                      bug.status === s 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    Marcar como {s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  placeholder="Escreva sua resposta para o cliente..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 transition-all outline-none resize-none pr-16"
                  rows={2}
                />
                <button
                  onClick={handleSendResponse}
                  disabled={loading || !response.trim()}
                  className="absolute right-3 bottom-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
