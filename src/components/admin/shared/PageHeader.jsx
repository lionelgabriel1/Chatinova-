import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        {children}
      </motion.div>
    </div>
  );
}
