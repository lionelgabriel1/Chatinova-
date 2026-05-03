import React from 'react';
import { motion } from 'framer-motion';
import UptimeCard from './UptimeCard';
import SystemStatusPopover from './SystemStatusPopover';
import AdminNotificationsPopover from './AdminNotificationsPopover';
import RealtimeAlertsPopover from './RealtimeAlertsPopover';
import ResourceUsageCard from './ResourceUsageCard';

export default function EnterpriseTopBar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-slate-950/20 p-4 md:p-1 rounded-3xl border border-white/5 md:border-none"
    >
      {/* Título e Subtítulo */}
      <div className="flex flex-col px-2">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
          Dashboard <span className="text-emerald-500">Admin</span>
        </h1>
        <p className="text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
          Monitoramento Enterprise
        </p>
      </div>

      {/* Grid de Componentes de Monitoramento */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <div className="hidden sm:block">
          <UptimeCard compact serviceName="inovachat-admin" />
        </div>
        <SystemStatusPopover />
        <RealtimeAlertsPopover />
        <AdminNotificationsPopover />
        <div className="hidden lg:block">
          <ResourceUsageCard />
        </div>
      </div>
    </motion.div>
  );
}
