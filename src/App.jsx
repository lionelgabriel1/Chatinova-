import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Clientes from './pages/admin/Clientes';
import Instancias from './pages/admin/Instancias';
import MensagensAdmin from './pages/admin/MensagensAdmin';
import AvisosAdmin from './pages/admin/AvisosAdmin';
import MensagensCliente from './pages/client/MensagensCliente';
import Acessos from './pages/admin/Acessos';
import Logs from './pages/admin/Logs';
import BugsAdmin from './pages/admin/Bugs';
import Configuracoes from './pages/admin/Configuracoes';
import Solicitacoes from './pages/admin/Solicitacoes';
import Administradores from './pages/admin/Administradores';

import LoginCliente from './pages/client/LoginCliente';
import CadastroCliente from './pages/client/CadastroCliente';
import DashboardCliente from './pages/client/DashboardCliente';
import WhatsappCliente from './pages/client/WhatsappCliente';
import MemoriaIACliente from './pages/client/MemoriaIACliente';
import NotificacoesCliente from './pages/client/NotificacoesCliente';
import AvisosCliente from './pages/client/AvisosCliente';
import ReportarBug from './pages/client/ReportarBug';
import PerfilCliente from './pages/client/PerfilCliente';
import ConfiguracoesCliente from './pages/client/ConfiguracoesCliente';
import LandingPage from './pages/LandingPage';

import ClienteProtectedRoute from './routes/ClienteProtectedRoute';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import ToastProvider from './components/ui/ToastProvider';
import { useAccessTracker } from './hooks/useAccessTracker';
import MaintenanceGuard from './routes/MaintenanceGuard';

// Componente para rastreamento global
function GlobalTracker() {
  useAccessTracker();
  return null;
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <GlobalTracker />
        <MaintenanceGuard>
          <Routes>
            {/* Landing Page Pública */}
            <Route path="/" element={<LandingPage />} />

            {/* Rotas de Cliente (Públicas) */}
            <Route path="/login" element={<LoginCliente />} />
            <Route path="/cadastro" element={<CadastroCliente />} />

            {/* Rotas de Cliente (Protegidas) */}
            <Route 
              path="/cliente/dashboard" 
              element={<ClienteProtectedRoute><DashboardCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/whatsapp" 
              element={<ClienteProtectedRoute><WhatsappCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/memoria-ia" 
              element={<ClienteProtectedRoute><MemoriaIACliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/notificacoes" 
              element={<ClienteProtectedRoute><NotificacoesCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/chat" 
              element={<ClienteProtectedRoute><MensagensCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/avisos" 
              element={<ClienteProtectedRoute><AvisosCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/perfil" 
              element={<ClienteProtectedRoute><PerfilCliente /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/reportar-bug" 
              element={<ClienteProtectedRoute><ReportarBug /></ClienteProtectedRoute>} 
            />
            <Route 
              path="/cliente/configuracoes" 
              element={<ClienteProtectedRoute><ConfiguracoesCliente /></ClienteProtectedRoute>} 
            />
            
            {/* Fallback do cliente */}
            <Route path="/cliente" element={<Navigate to="/cliente/dashboard" replace />} />

            {/* Rotas de Admin (Públicas) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rotas de Admin (Protegidas) */}
            <Route 
              path="/admin/dashboard" 
              element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/clientes" 
              element={<AdminProtectedRoute><Clientes /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/instancias" 
              element={<AdminProtectedRoute><Instancias /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/mensagens" 
              element={<AdminProtectedRoute><MensagensAdmin /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/avisos" 
              element={<AdminProtectedRoute><AvisosAdmin /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/acessos" 
              element={<AdminProtectedRoute><Acessos /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/logs" 
              element={<AdminProtectedRoute><Logs /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/bugs" 
              element={<AdminProtectedRoute><BugsAdmin /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/configuracoes" 
              element={<AdminProtectedRoute><Configuracoes /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/solicitacoes" 
              element={<AdminProtectedRoute><Solicitacoes /></AdminProtectedRoute>} 
            />
            <Route 
              path="/admin/administradores" 
              element={<AdminProtectedRoute><Administradores /></AdminProtectedRoute>} 
            />
            
            {/* Fallback do admin */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Fallback Global */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MaintenanceGuard>
      </Router>
    </ToastProvider>
  );
}

export default App;
