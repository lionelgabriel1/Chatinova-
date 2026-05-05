import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { clientAuthService } from '../services/clientAuthService';

const ClienteProtectedRoute = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verificar() {
      try {
        const dados = await clientAuthService.getClienteLogado();
        setCliente(dados);
      } catch (error) {
        setCliente(null);
      } finally {
        setLoading(false);
      }
    }
    verificar();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cliente) {
    return <Navigate to="/login" replace />;
  }

  if (cliente.status === 'bloqueado' || cliente.status === 'suspenso') {
    clientAuthService.logoutCliente();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ClienteProtectedRoute;
