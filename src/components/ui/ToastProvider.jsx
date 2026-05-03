import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ToastContext } from '../../hooks/useToast';
import Toast from './Toast';

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, title) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => {
      // Evitar duplicatas exatas já presentes
      const isDuplicate = prev.some(t => t.message === message && t.type === type);
      if (isDuplicate) return prev;
      return [...prev, { id, type, message, title }];
    });

    // Auto remove after 5 seconds (apenas se foi adicionado)
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const toast = {
    success: (msg, title) => addToast('success', msg, title || 'Sucesso!'),
    error: (msg, title) => addToast('error', msg, title || 'Erro'),
    warning: (msg, title) => addToast('warning', msg, title || 'Atenção'),
    info: (msg, title) => addToast('info', msg, title || 'Informação'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - Top Right */}
      <div className="fixed top-10 right-10 z-[9999] flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <Toast
                key={t.id}
                {...t}
                onClose={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
