import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  RefreshCw, 
  Power, 
  AlertCircle,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientInstanceService } from '../../services/clientInstanceService';
import { useToast } from '../../hooks/useToast';
import { formatDateTime } from '../../utils/date';

export default function WhatsappCliente() {
  const toast = useToast();
  const [instances, setInstances] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFriendlyName, setNewFriendlyName] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeInstance, setActiveInstance] = useState(null);
  const [qrcode, setQrcode] = useState(null);
  const [pollingStatus, setPollingStatus] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [instancesData, profileData] = await Promise.all([
        clientInstanceService.getMyInstances(),
        clientInstanceService.getMyProfile()
      ]);

      // Buscar status em tempo real para cada instância
      const instancesWithStatus = await Promise.all(
        instancesData.map(async (inst) => {
          try {
            const isConnected = await clientInstanceService.getStatus(inst.instance_name);
            return {
              ...inst,
              status: isConnected ? 'open' : 'close'
            };
          } catch (e) {
            return { ...inst, status: 'close' };
          }
        })
      );

      setInstances(instancesWithStatus);
      setProfile(profileData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Não foi possível carregar as instâncias.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fetchQR = async (instance) => {
    try {
      const data = await clientInstanceService.getQRCode(instance.instance_name);
      if (data.code) {
        setQrcode(data.code);
      } else if (data.base64) {
        setQrcode(data.base64);
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    }
  };

  // Polling para status da instância ativa e atualização do QR
  useEffect(() => {
    let interval;
    let ticks = 0;
    if (qrModalOpen && activeInstance) {
      interval = setInterval(async () => {
        ticks++;
        try {
          const isConnected = await clientInstanceService.getStatus(activeInstance.instance_name);
          if (isConnected) {
            toast.success('WhatsApp conectado!');
            setQrModalOpen(false);
            loadData();
          } else if (ticks % 4 === 0) {
            // Atualiza o QR Code a cada 20 segundos para evitar expiração
            fetchQR(activeInstance);
          }
        } catch (e) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [qrModalOpen, activeInstance, loadData, toast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFriendlyName.trim()) return;
    
    setCreating(true);
    try {
      await clientInstanceService.createInstance(newFriendlyName);
      toast.success('Instância criada com sucesso!');
      setModalOpen(false);
      setNewFriendlyName('');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Erro ao criar instância.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (instance) => {
    if (!window.confirm(`Tem certeza que deseja excluir a instância "${instance.nome_instancia}"?`)) return;
    
    try {
      await clientInstanceService.deleteInstance(instance.id, instance.instance_id);
      toast.success('Instância removida.');
      loadData();
    } catch (error) {
      toast.error('Falha ao remover instância.');
    }
  };

  const handleShowQR = async (instance) => {
    setActiveInstance(instance);
    setQrModalOpen(true);
    setQrcode(null);
    fetchQR(instance);
  };

  const handleLogout = async (instance) => {
    if (!window.confirm('Deseja realmente desconectar?')) return;
    try {
      await clientInstanceService.logoutInstance(instance.instance_name);
      toast.info('Instância desconectada.');
      loadData();
    } catch (error) {
      toast.error('Erro ao desconectar.');
    }
  };

  const usagePercent = profile ? (instances.length / profile.limite_instancias) * 100 : 0;

  return (
    <ClienteLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">WHATSAPP<span className="text-emerald-500">.</span></h1>
          <p className="text-slate-500 font-medium">Conecte seus números e ative o poder da IA no seu atendimento.</p>
        </div>
        
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-lg shadow-emerald-600/20 transition-all active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          Nova Instância
        </button>
      </div>

      {/* Usage Bar */}
      <div className="mb-12 bg-slate-900/40 border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <ShieldCheck className="text-emerald-500" size={18} />
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Uso do Plano</span>
          </div>
          <span className="text-sm font-black text-white">
            {instances.length} de {profile?.limite_instancias || 0} instâncias usadas
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${usagePercent}%` }}
            className={`h-full rounded-full ${usagePercent >= 100 ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.3)]`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RefreshCw className="animate-spin text-emerald-500" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Carregando suas conexões...</p>
        </div>
      ) : instances.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center max-w-lg mx-auto">
           <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-slate-700 mb-8 border border-white/5">
              <Smartphone size={40} />
           </div>
           <h3 className="text-2xl font-black text-white mb-4">Nenhuma Instância Conectada</h3>
           <p className="text-slate-500 mb-10 leading-relaxed">
             Para começar a usar a IA, você precisa criar uma instância e conectar seu número de WhatsApp.
           </p>
           <button 
             onClick={() => setModalOpen(true)}
             className="px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black shadow-xl shadow-white/5 hover:bg-emerald-500 hover:text-white transition-all"
           >
             Criar Minha Primeira Instância
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((inst) => (
            <motion.div 
              key={inst.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${inst.status === 'open' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-500'}`}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight">{inst.nome_instancia}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${inst.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${inst.status === 'open' ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {inst.status === 'open' ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Número</span>
                  <span className="font-black text-white">{inst.numero_whatsapp || '---'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">ID Técnico</span>
                  <span className="font-mono text-slate-600">{inst.instance_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5 relative z-10">
                {inst.status !== 'open' ? (
                  <button 
                    onClick={() => handleShowQR(inst)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all"
                  >
                    <QrCode size={16} /> Conectar
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLogout(inst)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-black transition-all"
                  >
                    <Power size={16} /> Logout
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(inst)}
                  className="p-3 bg-white/5 hover:bg-rose-600/20 hover:text-rose-500 text-slate-500 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Criar Instância */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !creating && setModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
               
               <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Nova Conexão</h2>
                  <p className="text-slate-500 text-sm font-medium">Dê um nome para identificar este número.</p>
               </div>

               <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Instância</label>
                     <input 
                       value={newFriendlyName} 
                       onChange={e => setNewFriendlyName(e.target.value)} 
                       placeholder="Ex: Suporte, Vendas, Loja 1"
                       className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                       disabled={creating}
                       autoFocus
                     />
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-4 font-black text-slate-500 hover:text-white transition-all">Cancelar</button>
                     <button 
                       type="submit" 
                       disabled={creating || !newFriendlyName.trim()}
                       className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                     >
                       {creating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                       {creating ? 'Criando...' : 'Criar Agora'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal QR Code */}
      <AnimatePresence>
        {qrModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQrModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 flex flex-col items-center text-center shadow-2xl"
            >
               <div className="mb-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <QrCode size={32} />
                  </div>
                  <h2 className="text-slate-900 text-3xl font-black mb-2 tracking-tight">Escaneie o Código</h2>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Abra o WhatsApp {'>'} Configurações {'>'} Aparelhos Conectados no seu celular.
                  </p>
               </div>

               <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-slate-100 mb-10 relative">
                  <div className="absolute top-8 left-8 right-8 h-1 bg-emerald-500/40 blur-sm animate-[scan_2.5s_ease-in-out_infinite] z-20" />
                  <div className="relative z-10 bg-white p-6 rounded-[2.5rem] shadow-xl">
                     {!qrcode ? (
                       <div className="w-64 h-64 flex flex-col items-center justify-center gap-4">
                         <Loader2 className="animate-spin text-emerald-500" size={48} />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerando Código...</span>
                       </div>
                     ) : (
                       qrcode.includes('base64') || qrcode.length > 500 ? (
                         <img src={qrcode.startsWith('data:') ? qrcode : `data:image/png;base64,${qrcode}`} alt="QR Code" className="w-64 h-64" />
                       ) : (
                         <QRCodeCanvas value={qrcode} size={256} level="H" includeMargin={true} />
                       )
                     )}
                  </div>
               </div>

               <div className="space-y-6 w-full">
                  <div className="flex items-center justify-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                     <RefreshCw size={14} className="animate-spin" />
                     Sincronizando com seu dispositivo
                  </div>
                  
                  <button 
                    onClick={() => setQrModalOpen(false)}
                    className="w-full py-4 text-slate-400 hover:text-slate-900 font-black text-sm transition-all"
                  >
                    Fechar e continuar depois
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 2rem; opacity: 0.2; }
          50% { top: calc(100% - 3rem); opacity: 1; }
        }
      `}} />
    </ClienteLayout>
  );
}
