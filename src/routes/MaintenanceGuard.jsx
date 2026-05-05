import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import MaintenanceGate from '../pages/MaintenanceGate';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Páginas onde não devemos incomodar com erros
const publicPages = ['/login', '/cadastro', '/esqueci-senha', '/'];

export default function MaintenanceGuard({ children }) {
  const [maintenance, setMaintenance] = useState({ enabled: false, loading: true });
  const [unlocked, setUnlocked] = useState(maintenanceService.isUnlocked());
  const location = useLocation();

  useEffect(() => {
    const isPublic = publicPages.some(p => location.pathname.startsWith(p));

    const checkInitialStatus = async () => {
      try {
        const status = await maintenanceService.getStatus();
        setMaintenance({ enabled: status.enabled, loading: false });
      } catch (error) {
        // Em páginas públicas, apenas desabilita manutenção silenciosamente
        console.warn('Manutenção: usando fallback (desabilitado)');
        setMaintenance({ enabled: false, loading: false });
      }
    };

    checkInitialStatus();

    const subscription = maintenanceService.subscribeStatus((newStatus) => {
      setMaintenance({ enabled: newStatus.enabled, loading: false });
      if (!newStatus.enabled) {
        maintenanceService.setUnlocked(false);
        setUnlocked(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (maintenance.loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    );
  }

  if (maintenance.enabled && !unlocked) {
    return <MaintenanceGate />;
  }

  return children;
}
