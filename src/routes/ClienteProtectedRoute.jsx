import React from 'react';
import { Navigate } from 'react-router-dom';
import { clientAuthService } from '../services/clientAuthService';

const ClienteProtectedRoute = ({ children }) => {
  const cliente = clientAuthService.getClienteLogado();

  if (!cliente) {
    return <Navigate to="/login" replace />;
  }

  // Verificar status
  if (cliente.status === 'bloqueado' || cliente.status === 'suspenso') {
    clientAuthService.logoutCliente();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ClienteProtectedRoute;
