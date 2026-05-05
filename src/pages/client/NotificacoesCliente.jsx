import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientNotificationsService } from '../../services/clientPanelServices';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';
import { formatDateTime } from '../../utils/date';

export default function NotificacoesCliente() {
  const toast = useToast();
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState(null);

  // Buscar o cliente de forma assíncrona
  useEffect(() => {
    async function loadCliente() {
      const data = await clientAuthService.getClienteLogado();
      setCliente(data);
    }
    loadCliente();
  }, []);

  const loadData = async () => {
    if (!cliente?.id) return;
    try {
      setLoading(true);
      const data = await clientNotificationsService.getAll(cliente.id);
      setNotificacoes(data);
    } catch (error) {
      toast.error('Falha ao carregar notificações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cliente) {
      loadData();
    }
  }, [cliente]);

  const handleMarkAsRead = async (id) => {
    try {
      await clientNotificationsService.markAsRead(id);
      setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, lida: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'success': return <CheckCircle className="text-emerald-400" size={20} />;
      case 'warning': return <AlertTriangle className="text-orange-400" size={20} />;
      case 'error': return <XCircle className="text-rose-400" size={20} />;
      default: return <Info className="text-blue-400" size={20} />;
    }
  };

  return (
    <ClienteLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Notificações</h1>
        <p className="text-slate-500 font-medium">Fique por dentro das atividades da sua conta.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
          ))
        ) : notificacoes.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-slate-600" size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Tudo limpo por aqui!</h3>
            <p className="text-slate-500 text-sm">Você não possui novas notificações no momento.</p>
          </div>
        ) : (
          notificacoes.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-[2rem] border transition-all flex gap-4 ${
                notif.lida
                ? 'bg-slate-900/20 border-white/5 opacity-60'
                : 'bg-slate-900/60 border-white/10 shadow-lg shadow-black/20'
              }`}
            >
              <div className="mt-1">{getIcon(notif.tipo)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h4 className={`font-bold ${notif.lida ? 'text-slate-400' : 'text-white'}`}>{notif.titulo}</h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {formatDateTime(notif.created_at)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{notif.mensagem}</p>
                {!notif.lida && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="mt-4 text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </ClienteLayout>
  );
}
