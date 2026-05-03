import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';

const TestAICTA = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center mb-6"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] animate-pulse-slow">
        <Sparkles size={18} className="text-emerald-100" />
        <span className="text-xs md:text-sm font-black uppercase tracking-wider">
          Teste a IA ao vivo agora ⬇️
        </span>
      </div>
      
      {/* Legenda sutil abaixo do badge */}
      <p className="mt-3 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.2em] opacity-80">
        Simule um cliente e veja a mágica
      </p>
    </motion.div>
  );
};

export default TestAICTA;
