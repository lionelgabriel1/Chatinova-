import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, CreditCard, Clock } from 'lucide-react';
import { planosService } from '../../../services/planosService';

export default function AprovarClienteModal({ isOpen, onClose, onApprove, client }) {
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [planos, setPlanos] = useState([]);
  const [selectedPlano, setSelectedPlano] = useState('');
  const [dias, setDias] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlanos();
    }
  }, [isOpen]);

  const loadPlanos = async () => {
    setLoadingPlanos(true);
    try {
      const data = await planosService.getPlanos();
      setPlanos(data);
      if (data.length > 0) setSelectedPlano(data[0].id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlanos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onApprove(client.id, selectedPlano, dias);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Aprovar Cadastro</h3>
                  <p className="text-slate-400 text-sm">Configure o acesso do cliente</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Cliente Selecionado</p>
              <p className="text-white font-bold">{client?.nome} {client?.sobrenome}</p>
              <p className="text-slate-400 text-sm">{client?.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Selecionar Plano</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select 
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 appearance-none"
                    value={selectedPlano}
                    onChange={(e) => setSelectedPlano(e.target.value)}
                  >
                    {loadingPlanos ? (
                      <option>Carregando planos...</option>
                    ) : planos.length === 0 ? (
                      <option>Nenhum plano encontrado</option>
                    ) : (
                      planos.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} ({p.limite_instancias} {p.limite_instancias === 1 ? 'conexão' : 'conexões'})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duração do Acesso (Dias)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select 
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 appearance-none"
                    value={dias}
                    onChange={(e) => setDias(e.target.value)}
                  >
                    <option value="7">Teste (7 dias)</option>
                    <option value="15">Quinzenal (15 dias)</option>
                    <option value="30">Mensal (30 dias)</option>
                    <option value="60">Bimestral (60 dias)</option>
                    <option value="90">Trimestral (90 dias)</option>
                    <option value="365">Anual (365 dias)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 px-6 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting || loadingPlanos}
                  className="flex-[2] py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Aprovando...' : 'Confirmar Aprovação'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
