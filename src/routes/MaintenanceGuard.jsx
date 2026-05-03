import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import MaintenanceGate from '../pages/MaintenanceGate';
import { Loader2 } from 'lucide-react';

export default function MaintenanceGuard({ children }) {
  const [maintenance, setMaintenance] = useState({ enabled: false, loading: true });
  const [unlocked, setUnlocked] = useState(maintenanceService.isUnlocked());

  useEffect(() => {
    // 1. Carregar status inicial
    const checkInitialStatus = async () => {
      const status = await maintenanceService.getStatus();
      setMaintenance({ enabled: status.enabled, loading: false });
    };

    checkInitialStatus();

    // 2. Realtime para bloqueio/liberação imediata
    const subscription = maintenanceService.subscribeStatus((newStatus) => {
      setMaintenance({ enabled: newStatus.enabled, loading: false });
      
      // Se a manutenção for desativada, garantir que a sessão de desbloqueio seja limpa
      if (!newStatus.enabled) {
        maintenanceService.setUnlocked(false);
        setUnlocked(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Se estiver carregando as configurações do banco
  if (maintenance.loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    );
  }

  // Se modo manutenção ATIVO e usuário NÃO DESBLOQUEOU com senha
  if (maintenance.enabled && !unlocked) {
    return <MaintenanceGate />;
  }

  // Caso contrário, renderiza o App normalmente
  return children;
}
