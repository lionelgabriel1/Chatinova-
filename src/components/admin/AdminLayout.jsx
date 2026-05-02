import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';
import AdminMessageNotifier from './AdminMessageNotifier';
import MainLayout from '../../layouts/MainLayout';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';

export default function AdminLayout({ children }) {
  const [counts, setCounts] = useState({ messages: 0, requests: 0, total: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapse();

  return (
    <MainLayout
      collapsed={collapsed}
      rootClassName="bg-[#020617] text-slate-200"
      background={(
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}
      sidebar={(
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          counts={counts}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />
      )}
    >
      <Header
        onMenuOpen={() => setIsSidebarOpen(true)}
        notificationCount={counts.total}
      />

      {/* Notificador de Mensagens e Solicitações em Tempo Real */}
      <AdminMessageNotifier onCountChange={setCounts} />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-4 md:p-8 relative z-10 w-full max-w-full overflow-x-hidden"
      >
        {children}
      </motion.main>
    </MainLayout>
  );
}
