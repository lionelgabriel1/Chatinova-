import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Globe, Mail, Clock, ShieldCheck, Activity, KeyRound, AlertTriangle } from 'lucide-react';
import { maintenanceService } from '../../../services/maintenanceService';
import { useToast } from '../../../hooks/useToast';

export default function ConfigGeral({ data, maintenanceData, onUpdate }) {
  const toast = useToast();
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: data || {}
  });

  const maintenanceEnabled = watch('maintenance_mode_active');
  const maintenancePassword = watch('maintenance_password');
  const maintenanceConfirm = watch('maintenance_password_confirm');

  useEffect(() => {
    reset({
      ...data,
      maintenance_mode_active: maintenanceData?.enabled || false
    });
  }, [data, maintenanceData, reset]);

  const onSubmit = async (values) => {
    // 1. Atualizar Configurações Gerais (Nome, Email, etc)
    const { maintenance_mode_active, maintenance_password, maintenance_password_confirm, ...geralValues } = values;
    await onUpdate('geral', geralValues);

    // 2. Verificar se houve mudança no Modo Manutenção
    const isChangingMaintenance = maintenance_mode_active !== (maintenanceData?.enabled || false);
    
    if (isChangingMaintenance || (maintenance_mode_active && maintenance_password)) {
      if (maintenance_mode_active) {
        // Validações
        if (!maintenance_password) {
          toast.error('Senha de manutenção é obrigatória para ativar o modo.');
          return;
        }
        if (maintenance_password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres.');
          return;
        }
        if (maintenance_password !== maintenance_password_confirm) {
          toast.error('As senhas não coincidem.');
          return;
        }
      }

      setLoadingMaintenance(true);
      try {
        await maintenanceService.updateConfig(maintenance_mode_active, maintenance_password);
        toast.success(maintenance_mode_active ? 'Modo Manutenção ATIVADO' : 'Modo Manutenção DESATIVADO');
      } catch (error) {
        toast.error('Erro ao atualizar modo manutenção: ' + error.message);
      } finally {
        setLoadingMaintenance(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Globe size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Configurações Gerais</h2>
          <p className="text-xs text-slate-500">Identidade e comportamento global do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome do Sistema</label>
                <input 
                  {...register('system_name')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Exibido</label>
                <input 
                  {...register('display_name')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email de Suporte</label>
                <input 
                  {...register('support_email')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fuso Horário</label>
                <select 
                  {...register('timezone')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            {/* Modo Manutenção */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${maintenanceEnabled ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-lg ${maintenanceEnabled ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Modo Manutenção</h4>
                  <p className="text-xs text-slate-500">Ao ativar, todo o sistema será bloqueado por senha, incluindo landing page e painéis.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('maintenance_mode_active')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {maintenanceEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-500/10 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <KeyRound size={10} />
                      Nova Senha de Acesso
                    </label>
                    <input 
                      type="password"
                      {...register('maintenance_password')}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <ShieldCheck size={10} />
                      Confirmar Senha
                    </label>
                    <input 
                      type="password"
                      {...register('maintenance_password_confirm')}
                      placeholder="Repita a senha"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loadingMaintenance}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Save size={18} />
              {loadingMaintenance ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Status do Sistema</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${maintenanceEnabled ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
              <span className={`text-xl font-bold ${maintenanceEnabled ? 'text-amber-400' : 'text-emerald-400'}`}>
                {maintenanceEnabled ? 'MANUTENÇÃO' : 'ONLINE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 uppercase">Monitorado via Supabase Edge</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Atividade</span>
            </div>
            <p className="text-xs text-slate-400">Última atualização:</p>
            <p className="text-sm font-bold text-white mt-1">
              {maintenanceData?.updated_at ? new Date(maintenanceData.updated_at).toLocaleString() : 'Hoje às 12:45'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
