import React, { useState } from 'react';
import { Send, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';
import { bugReportService } from '../../../services/bugReportService';
import BugAttachmentPreview from './BugAttachmentPreview';

export default function BugReportForm({ clienteId, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    pagina: '',
    prioridade: 'media'
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao) {
      toast.error('Título e Descrição são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await bugReportService.createBugReport({
        ...formData,
        cliente_id: clienteId
      }, file);

      toast.success('Bug enviado com sucesso. Nossa equipe irá analisar.');
      setFormData({ titulo: '', descricao: '', pagina: '', prioridade: 'media' });
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erro ao enviar bug report.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 border border-white/5 rounded-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Título do Problema</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Erro ao carregar mensagens no WhatsApp"
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Página Ocorreu</label>
          <input
            type="text"
            value={formData.pagina}
            onChange={e => setFormData({ ...formData, pagina: e.target.value })}
            placeholder="Ex: /cliente/whatsapp"
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Prioridade</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['baixa', 'media', 'alta', 'urgente'].map((prio) => (
            <button
              key={prio}
              type="button"
              onClick={() => setFormData({ ...formData, prioridade: prio })}
              className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                formData.prioridade === prio
                ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-slate-800/30 border-white/5 text-slate-500 hover:border-white/20'
              }`}
            >
              {prio}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Descrição Detalhada</label>
        <textarea
          value={formData.descricao}
          onChange={e => setFormData({ ...formData, descricao: e.target.value })}
          rows={4}
          placeholder="Descreva detalhadamente o que aconteceu e como reproduzir o erro..."
          className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 transition-all outline-none resize-none"
        />
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Anexar Evidência</label>
        <div className="flex flex-wrap gap-4 items-start">
          <BugAttachmentPreview file={file} onRemove={() => setFile(null)} />
          
          {!file && (
            <label className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-500 group">
              <Upload size={24} className="group-hover:text-purple-400" />
              <span className="text-[10px] font-bold uppercase">Anexar</span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
            </label>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={20} />
              Enviar Bug Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}
