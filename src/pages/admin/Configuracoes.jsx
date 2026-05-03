import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import { 
  Settings, 
  Shield, 
  Bot, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  Share2,
  RefreshCw
} from 'lucide-react';
import { configService } from '../../services/configService';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes de Aba
import ConfigGeral from '../../components/admin/config/ConfigGeral';
import ConfigSeguranca from '../../components/admin/config/ConfigSeguranca';
import ConfigIA from '../../components/admin/config/ConfigIA';
import ConfigWhatsApp from '../../components/admin/config/ConfigWhatsApp';
import ConfigPlanos from '../../components/admin/config/ConfigPlanos';
import ConfigNotificacoes from '../../components/admin/config/ConfigNotificacoes';
import ConfigIntegracoes from '../../components/admin/config/ConfigIntegracoes';

const TABS = [
  { id: 'geral', label: 'Geral', icon: Settings },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
  { id: 'ia', label: 'IA / Groq', icon: Bot },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'planos', label: 'Planos', icon: CreditCard },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'integracoes', label: 'Integrações', icon: Share2 },
];

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral');
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = await configService.getAll();
      setConfigs(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar configurações do banco.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdateConfig = async (chave, novoValor) => {
    try {
      await configService.setConfig(chave, novoValor);
      setConfigs(prev => ({ ...prev, [chave]: novoValor }));
      toast.success('Configurações atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  if (loading) {
     return (
        <AdminLayout>
           <div className="flex items-center justify-center h-[60vh]">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
           </div>
        </AdminLayout>
     );
  }

  return (
    <AdminLayout>
      <PageHeader title="Configurações" subtitle="Central de controle do INOVACHAT Admin" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Abas */}
        <div className="w-full lg:w-64 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo Aba */}
        <div className="flex-1">
          <div className="glass-card border border-slate-800 rounded-3xl p-8 bg-slate-900/20 shadow-2xl overflow-hidden min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'geral' && (
                  <ConfigGeral 
                    data={configs.geral} 
                    maintenanceData={configs.maintenance_mode}
                    onUpdate={handleUpdateConfig} 
                  />
                )}
                {activeTab === 'seguranca' && <ConfigSeguranca data={configs.seguranca} onUpdate={handleUpdateConfig} />}
                {activeTab === 'ia' && <ConfigIA data={configs.ia_groq} onUpdate={handleUpdateConfig} />}
                {activeTab === 'whatsapp' && <ConfigWhatsApp data={configs.gateway_whatsapp} onUpdate={handleUpdateConfig} />}
                {activeTab === 'planos' && <ConfigPlanos />}
                {activeTab === 'notificacoes' && <ConfigNotificacoes data={configs.notificacoes} onUpdate={handleUpdateConfig} />}
                {activeTab === 'integracoes' && <ConfigIntegracoes />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
