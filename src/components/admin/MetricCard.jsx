import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Skeleton from './Skeleton';

export default function MetricCard({ title, value, icon: Icon, trend, trendValue, color = 'blue', loading = false }) {
  const colors = {
    blue: 'from-blue-600/20 to-blue-400/5 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    green: 'from-emerald-600/20 to-emerald-400/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    purple: 'from-purple-600/20 to-purple-400/5 text-purple-400 border-purple-500/20 shadow-purple-500/5',
    orange: 'from-orange-600/20 to-orange-400/5 text-orange-400 border-orange-500/20 shadow-orange-500/5',
    red: 'from-red-600/20 to-red-400/5 text-red-400 border-red-500/20 shadow-red-500/5',
    emerald: 'from-emerald-600/20 to-emerald-400/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
  };

  if (loading) {
    return (
      <div className="glass-card p-4 md:p-6 border border-slate-800 rounded-2xl bg-slate-900/40 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
          <Skeleton className="w-12 md:w-16 h-4 rounded-lg" />
        </div>
        <div>
          <Skeleton className="w-24 md:w-32 h-4 rounded-lg mb-2" />
          <Skeleton className="w-16 md:w-20 h-8 rounded-lg" />
        </div>
      </div>
    );
  }

  const displayValue = value !== undefined && value !== null ? value : 0;
  const showEmpty = displayValue === 0;

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`glass-card p-4 md:p-6 border rounded-2xl bg-gradient-to-br ${colors[color] || colors.blue} shadow-xl flex flex-col gap-3 md:gap-4 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        {trend && !showEmpty && (
          <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-slate-400 text-xs md:text-sm font-medium">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-white mt-0.5 md:mt-1 tracking-tight">{displayValue}</p>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1 md:mt-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: showEmpty ? '0%' : '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full bg-current opacity-50`}
        />
      </div>
    </motion.div>
  );
}
