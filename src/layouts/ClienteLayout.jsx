import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BrainCircuit, 
  Bell, 
  AlertCircle, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  LifeBuoy
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clientAuthService } from '../services/clientAuthService';
import RealtimeNotifications from '../components/RealtimeNotifications';
import ClienteNotificationsBell from '../components/client/ClienteNotificationsBell';
import { accessService } from '../services/accessService';
import { logsService } from '../services/logsService';
import MainLayout from './MainLayout';
import { useSidebarCollapse } from '../hooks/useSidebarCollapse';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/cliente/dashboard' },
  { icon: MessageSquare, label: 'WhatsApp', path: '/cliente/whatsapp' },
  { icon: BrainCircuit, label: 'Memória IA', path: '/cliente/memoria-ia' },
  { icon: Bell, label: 'Notificações', path: '/cliente/notificacoes' },
  { icon: LifeBuoy, label: 'Suporte', path: '/cliente/chat' },
  { icon: AlertCircle, label: 'Reportar Bug', path: '/cliente/reportar-bug' },
  { icon: User, label: 'Perfil', path: '/cliente/perfil' },
  { icon: Settings, label: 'Configurações', path: '/cliente/configuracoes' },
];

export default function ClienteLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapse();
  const location = useLocation();
  const navigate = useNavigate();
  const cliente = clientAuthService.getClienteLogado();

  const handleLogout = async () => {
    if (cliente) {
      await accessService.markOffline(cliente.id);
      await logsService.createLog({
        tipo: 'login',
        nivel: 'info',
        titulo: 'Logoff efetuado',
        descricao: `Cliente ${cliente.nome} saiu do sistema`,
        usuario_tipo: 'cliente',
        usuario_id: cliente.id,
        usuario_nome: cliente.nome,
        usuario_email: cliente.email
      });
    }
    clientAuthService.logoutCliente();
    navigate('/login');
  };

  const renderSidebarContent = ({ isCompact = false, isMobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300`}>
      <div className={`p-6 ${isCompact ? 'px-2' : ''}`}>
        <div className={`flex items-center ${isCompact ? 'justify-center' : 'justify-between'} gap-3`}>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all order-2 ${isCompact ? 'mx-auto w-10 h-10' : ''}`}
              title={isCompact ? 'Expandir' : 'Recolher'}
            >
              {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
          
          <Link to="/cliente/dashboard" className={`flex items-center ${isCompact ? 'justify-center' : 'gap-3'}`}>
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg shadow-purple-600/20">
              <Zap size={24} className="text-white" />
            </div>
            {!isCompact && (
              <h1 className="text-xl font-black text-white tracking-tighter">
                INOVA<span className="text-purple-500">CHAT</span>
              </h1>
            )}
          </Link>
        </div>
      </div>

      <nav className={`flex-1 ${isCompact ? 'px-2' : 'px-4'} space-y-2 mt-4`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCompact ? item.label : undefined}
              className={`flex items-center ${isCompact ? 'justify-center px-0' : 'gap-4 px-4'} py-3 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-white/10 shadow-[0_8px_32px_-8px_rgba(139,92,246,0.3)]' 
                : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'} />
              {!isCompact && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {!isCompact && isActive && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-6 border-t border-white/5 ${isCompact ? 'px-2' : ''}`}>
        <button 
          onClick={handleLogout}
          title={isCompact ? 'Sair' : undefined}
          className={`flex items-center ${isCompact ? 'justify-center' : 'gap-4'} w-full px-4 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all group`}
        >
          <LogOut size={20} />
          {!isCompact && <span className="font-bold text-sm">Sair da Conta</span>}
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout
      collapsed={collapsed}
      rootClassName="bg-[#020617] text-slate-300"
      background={(
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}
      sidebar={(
        <>
          {/* Sidebar Desktop */}
          <aside className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-20 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-60'}`}>
            {renderSidebarContent({ isCompact: collapsed, isMobile: false })}
          </aside>
        </>
      )}
    >
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-slate-900/30 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-sm font-black text-white uppercase tracking-widest opacity-50">Painel do Cliente</h2>
              <p className="text-xs text-slate-500">Bem-vindo, {cliente?.nome}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Plano Ativo</span>
              <span className="text-sm font-bold text-white">Advanced AI Plus</span>
            </div>

            <ClienteNotificationsBell />
            
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black shadow-inner">
              {cliente?.nome?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
          <div className="max-w-7xl mx-auto">
            {children}
            <RealtimeNotifications />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-slate-900 z-50 lg:hidden flex flex-col"
            >
              {renderSidebarContent({ isCompact: false, isMobile: true })}
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="absolute top-6 right-6 text-slate-400 p-2 lg:hidden"
              >
                <X size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
