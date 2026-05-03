import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { avisosService } from '../../services/avisosService';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../services/supabase';

const getNoticeIcon = (tipo) => {
  switch (tipo) {
    case 'warning': return { icon: AlertTriangle, color: 'orange' };
    case 'error': return { icon: AlertCircle, color: 'rose' };
    case 'success': return { icon: CheckCircle, color: 'emerald' };
    default: return { icon: Info, color: 'blue' };
  }
};

const NoticeCard = ({ notice, onRead }) => {
  const { icon: Icon, color } = getNoticeIcon(notice.tipo);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-[2.5rem] border backdrop-blur-xl transition-all ${
        notice.lido ? 'bg-slate-900/20 border-white/5 opacity-60' : 'bg-slate-900/60 border-white/10 shadow-lg'
      }`}
    >
      <div className="flex items-start gap-5">
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-white tracking-tight">{notice.titulo}</h3>
            {!notice.lido && (
              <span className="px-2 py-1 bg-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Novo</span>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">{notice.mensagem}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(notice.created_at).toLocaleDateString()}
              </span>
              <span className={`px-2 py-0.5 rounded ${
                notice.prioridade === 'urgente' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-slate-500'
              }`}>
                {notice.prioridade}
              </span>
            </div>
            {!notice.lido && (
              <button 
                onClick={() => onRead(notice.id)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Eye size={14} /> Marcar como lido
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AvisosCliente() {
  const toast = useToast();
  const cliente = clientAuthService.getClienteLogado();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await avisosService.getNotices(cliente.id);
      setNotices(data);
    } catch (error) {
      toast.error('Erro ao carregar avisos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (avisoId) => {
    try {
      await avisosService.markAsRead(avisoId, cliente.id);
      setNotices(prev => prev.map(n => n.id === avisoId ? { ...n, lido: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();

    const channel = avisosService.subscribeToNewNotices((newNotice) => {
      setNotices(prev => [{ ...newNotice, lido: false }, ...prev]);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ClienteLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Comunicados</h1>
        <p className="text-slate-500 font-medium">Avisos importantes e atualizações do sistema.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {loading ? (
          <div className="py-12 text-center text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">
            Buscando comunicados...
          </div>
        ) : notices.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/5">
            <Bell size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhum aviso no momento</p>
          </div>
        ) : (
          notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} onRead={handleRead} />
          ))
        )}
      </div>
    </ClienteLayout>
  );
}
