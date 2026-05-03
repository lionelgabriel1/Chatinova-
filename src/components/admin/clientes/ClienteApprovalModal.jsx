import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Calendar, Zap } from 'lucide-react';
import { planosService } from '../../../services/planosService';

export default function ClienteApprovalModal({ isOpen, onClose, onConfirm, client }) {
  const [loading, setLoading] = useState(false);
  const [planos, setPlanos] = useState([]);
  const [selectedPlano, setSelectedPlano] = useState('');
  const [dias, setDias] = useState(30);

  useEffect(() => {
    if (isOpen) {
      const fetchPlanos = async () => {
        try {
          const data = await planosService.getPlanosAtivos();
          setPlanos(data);
          if (data.length > 0) setSelectedPlano(data[0].id);
        } catch (error) {
          console.error('Erro ao buscar planos:', error);
        }
      };
      fetchPlanos();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(client.id, selectedPlano, dias);
      onClose();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    } finally {
      setLoading(false);
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
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Aprovar Cliente</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{client?.nome} {client?.sobrenome}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Zap size={10} className="text-emerald-500" /> Selecionar Plano
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {planos.map((plano) => (
                    <label 
                      key={plano.id}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedPlano === plano.id 
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                          : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="plano" 
                        className="hidden" 
                        value={plano.id}
                        checked={selectedPlano === plano.id}
                        onChange={() => setSelectedPlano(plano.id)}
                      />
                      <div className="flex flex-col">
                        <span className={`font-black text-sm ${selectedPlano === plano.id ? 'text-white' : 'text-slate-300'}`}>{plano.nome}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{plano.limite_mensagens} msg/mês</span>
                      </div>
                      <span className="font-black text-emerald-400">{plano.preco ? `R$ ${plano.preco}` : 'Grátis/Incluso'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={10} className="text-emerald-500" /> Duração do Acesso (dias)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 30, 90, 365].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDias(d)}
                      className={`py-3 rounded-xl font-bold text-xs transition-all ${
                        dias === d 
                          ? 'bg-white text-slate-900 shadow-xl' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {d} dias
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-emerald-500 mt-2"
                  value={dias}
                  onChange={(e) => setDias(e.target.value)}
                  placeholder="Ou digite o número de dias"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading || !selectedPlano}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check size={18} />
                      ATIVAR ACESSO
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
