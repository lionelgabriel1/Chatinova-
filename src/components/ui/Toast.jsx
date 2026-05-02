import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-emerald-400" size={18} />,
  error: <XCircle className="text-red-400" size={18} />,
  warning: <AlertTriangle className="text-amber-400" size={18} />,
  info: <Info className="text-blue-400" size={18} />
};

const styles = {
  success: 'border-emerald-500/30 shadow-emerald-500/10',
  error: 'border-red-500/30 shadow-red-500/10',
  warning: 'border-amber-500/30 shadow-amber-500/10',
  info: 'border-blue-500/30 shadow-blue-500/10'
};

export default function Toast({ id, type = 'success', title, message, onClose }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`
        relative flex gap-4 p-4 min-w-[320px] max-w-[400px]
        bg-slate-900/80 backdrop-blur-xl border ${styles[type]}
        rounded-2xl shadow-2xl overflow-hidden group
      `}
    >
      {/* Background Glow */}
      <div className={`absolute -left-10 -top-10 w-20 h-20 blur-3xl opacity-20 bg-${type === 'success' ? 'emerald' : type === 'error' ? 'red' : 'blue'}-500`} />

      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>

      <div className="flex-1 space-y-1 pr-4">
        {title && <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>}
        <p className="text-xs text-slate-400 leading-relaxed font-medium">{message}</p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={14} />
      </button>

      {/* Progress Bar */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[2px] bg-${type === 'success' ? 'emerald' : type === 'error' ? 'red' : 'blue'}-500/50`}
      />
    </motion.div>
  );
}
