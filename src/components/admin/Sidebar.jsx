import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Shield, 
  Zap,
  Bell,
  UserPlus,
  History,
  X,
  Bug,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <Users size={20} />, label: 'Clientes', path: '/admin/clientes' },
  { icon: <UserPlus size={20} />, label: 'Solicitações', path: '/admin/solicitacoes' },
  { icon: <Zap size={20} />, label: 'Instâncias', path: '/admin/instancias' },
  { icon: <MessageSquare size={20} />, label: 'Mensagens', path: '/admin/mensagens' },
  { icon: <Bell size={20} />, label: 'Avisos', path: '/admin/avisos' },
  { icon: <Shield size={20} />, label: 'Acessos', path: '/admin/acessos' },
  { icon: <Bug size={20} />, label: 'Bugs', path: '/admin/bugs' },
  { icon: <ShieldCheck size={20} />, label: 'Administradores', path: '/admin/administradores' },
  { icon: <History size={20} />, label: 'Logs', path: '/admin/logs' },
  { icon: <Settings size={20} />, label: 'Configurações', path: '/admin/configuracoes' },
];

export default function Sidebar({
  isOpen,
  onClose,
  counts = { messages: 0, requests: 0 },
  collapsed = false,
  onToggleCollapse,
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const getBadge = (path) => {
    if (path === '/admin/solicitacoes' && counts.requests > 0) return counts.requests;
    if (path === '/admin/mensagens' && counts.messages > 0) return counts.messages;
    if (path === '/admin/bugs' && counts.bugs > 0) return counts.bugs;
    return null;
  };

  const renderSidebarContent = ({ isCompact = false, isMobile = false }) => (
    <div className="flex flex-col h-full bg-[#020617] border-r border-slate-800/50">
      {/* Brand */}
      <div className={`p-4 ${isCompact ? 'space-y-4' : 'space-y-3'}`}>
        <div className={`flex items-center ${isCompact ? 'justify-center' : 'justify-between'} gap-3`}>
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex items-center justify-center rounded-xl border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all duration-300 ${
                isCompact ? 'w-10 h-10 mx-auto order-2' : 'w-8 h-8 order-2'
              }`}
              title={isCompact ? 'Expandir menu' : 'Recolher menu'}
              aria-label={isCompact ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}

          <div className={`flex items-center ${isCompact ? 'justify-center w-full' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Shield className="text-white" size={24} />
            </div>
            {!isCompact && (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                INOVACHAT <span className="text-[10px] text-blue-500 opacity-50">v1.2</span>
              </span>
            )}
          </div>
        </div>

        {/* Close button for mobile */}
        {isMobile && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className={`flex-1 ${isCompact ? 'px-2' : 'px-4'} space-y-1 overflow-y-auto`}>
        {menuItems.map((item) => {
          const badge = getBadge(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCompact ? item.label : undefined}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center ${isCompact ? 'justify-center px-2 py-3.5' : 'justify-between px-4 py-3.5'} rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}
              `}
            >
              <div className={`flex items-center ${isCompact ? 'justify-center' : 'gap-3'}`}>
                <span className="shrink-0 transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                {!isCompact && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
              </div>
              
              {!isCompact && badge && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  item.path === '/admin/solicitacoes' ? 'bg-emerald-500/20 text-emerald-400' : 
                  item.path === '/admin/bugs' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={handleLogout}
          title={isCompact ? 'Sair do painel' : undefined}
          className={`w-full rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold group ${
            isCompact ? 'flex items-center justify-center px-2 py-3.5' : 'flex items-center gap-3 px-4 py-3.5'
          }`}
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          {!isCompact && <span className="text-sm">Sair do Painel</span>}
        </button>
      </div>
    </div>
  );

  const sidebarContent = renderSidebarContent({ isCompact: collapsed, isMobile: false });
  const mobileSidebarContent = renderSidebarContent({ isCompact: false, isMobile: true });

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Portal-like with Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-[60] lg:hidden"
            >
              {mobileSidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
