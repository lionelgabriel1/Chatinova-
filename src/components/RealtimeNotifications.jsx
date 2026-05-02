import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { avisosService } from '../services/avisosService';
import { supabase } from '../services/supabase';

export default function RealtimeNotifications() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const channel = avisosService.subscribeToNewNotices((newNotice) => {
      setNotification(newNotice);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setNotification(null);
      }, 10000);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div 
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-8 right-8 z-[100] w-80 bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-900/40 p-5 backdrop-blur-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Bell size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-white font-black text-sm tracking-tight truncate pr-4">
                  Novo Aviso
                </h4>
                <button 
                  onClick={() => setNotification(null)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-300 mb-1 truncate">{notification.titulo}</p>
              <p className="text-[10px] font-medium text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                {notification.mensagem}
              </p>
              
              <button 
                onClick={() => {
                  setNotification(null);
                  navigate('/cliente/avisos');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ExternalLink size={12} /> Ver Comunicado
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
