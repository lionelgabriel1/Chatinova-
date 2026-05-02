import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Megaphone
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { avisosService } from '../../services/avisosService';
import { useToast } from '../../hooks/useToast';

const TIPOS_AVISO = [
  { id: 'info', label: 'Informação', icon: Info, color: 'blue' },
  { id: 'warning', label: 'Aviso', icon: AlertTriangle, color: 'orange' },
  { id: 'error', label: 'Erro/Crítico', icon: AlertCircle, color: 'rose' },
  { id: 'success', label: 'Sucesso', icon: CheckCircle, color: 'emerald' }
];

const PRIORIDADES = [
  { id: 'normal', label: 'Normal' },
  { id: 'alta', label: 'Alta' },
  { id: 'urgente', label: 'Urgente' }
];

export default function AvisosAdmin() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'info',
    prioridade: 'normal'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.mensagem) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await avisosService.createNotice({
        ...formData,
        global: true
      });
      toast.success('Aviso global enviado com sucesso!');
      setFormData({
        titulo: '',
        mensagem: '',
        tipo: 'info',
        prioridade: 'normal'
      });
    } catch (error) {
      toast.error('Erro ao enviar aviso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Central de Avisos</h1>
          <p className="text-slate-500 font-medium">Envie comunicados em tempo real para todos os clientes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Título do Comunicado</label>
                <input 
                  type="text" 
                  value={formData.titulo}
                  onChange={e => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Ex: Manutenção Programada"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-white font-medium focus:ring-2 ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Mensagem</label>
                <textarea 
                  rows={4}
                  value={formData.mensagem}
                  onChange={e => setFormData({...formData, mensagem: e.target.value})}
                  placeholder="Descreva o aviso detalhadamente..."
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-white font-medium focus:ring-2 ring-indigo-500/20 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Tipo</label>
                  <select 
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold focus:ring-2 ring-indigo-500/20 transition-all outline-none appearance-none"
                  >
                    {TIPOS_AVISO.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Prioridade</label>
                  <select 
                    value={formData.prioridade}
                    onChange={e => setFormData({...formData, prioridade: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold focus:ring-2 ring-indigo-500/20 transition-all outline-none appearance-none"
                  >
                    {PRIORIDADES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-5 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
              >
                {loading ? 'Enviando...' : (
                  <>
                    <Send size={20} />
                    Enviar Aviso Global
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Megaphone size={18} className="text-indigo-400" /> Preview do Aviso
            </h3>
            
            <motion.div 
              layout
              className={`p-6 rounded-[2rem] border bg-slate-900/60 backdrop-blur-xl ${
                formData.tipo === 'warning' ? 'border-orange-500/20' : 
                formData.tipo === 'error' ? 'border-rose-500/20' : 
                formData.tipo === 'success' ? 'border-emerald-500/20' : 'border-white/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl bg-indigo-500/10 text-indigo-400`}>
                  <Bell size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black tracking-tight mb-1">{formData.titulo || 'Título do Aviso'}</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    {formData.mensagem || 'O conteúdo da mensagem aparecerá aqui para os clientes em tempo real.'}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded text-slate-500">
                      {formData.prioridade}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      Agora mesmo
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/10">
              <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-widest mb-2">Dica de Admin</h4>
              <p className="text-indigo-200/60 text-xs leading-relaxed">
                Avisos urgentes aparecerão como popups imediatos para todos os clientes logados no sistema via Supabase Realtime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
