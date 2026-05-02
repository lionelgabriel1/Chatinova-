import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from '../Skeleton';

export default function StatCard({ title, value, icon: Icon, color = 'blue', loading = false }) {
  const colors = {
    blue: 'from-blue-600/20 to-blue-400/5 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    green: 'from-emerald-600/20 to-emerald-400/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    purple: 'from-purple-600/20 to-purple-400/5 text-purple-400 border-purple-500/20 shadow-purple-500/5',
    orange: 'from-orange-600/20 to-orange-400/5 text-orange-400 border-orange-500/20 shadow-orange-500/5',
    red: 'from-red-600/20 to-red-400/5 text-red-400 border-red-500/20 shadow-red-500/5',
  };

  if (loading) {
    return (
      <div className="glass-card p-6 border border-slate-800 rounded-2xl bg-slate-900/40 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
        <div>
          <Skeleton className="w-24 h-4 rounded-lg mb-2" />
          <Skeleton className="w-16 h-6 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-6 border rounded-2xl bg-gradient-to-br ${colors[color]} flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value !== undefined ? value : 0}</p>
      </div>
    </motion.div>
  );
}
