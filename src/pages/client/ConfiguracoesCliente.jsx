import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Clock, Pause, Bot, MessageSquare, Save } from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientSettingsService } from '../../services/clientPanelServices';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
    <div>
      <p className="font-bold text-white mb-1">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-purple-600' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default function ConfiguracoesCliente() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    responder_automatico: true,
    pausar_ia: false,
    horario_atendimento_ativo: false,
    horario_inicio: '08:00',
    horario_fim: '18:00',
    notificar_novas_mensagens: true,
    mensagem_ausencia: ''
  });

  const cliente = clientAuthService.getClienteLogado();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clientSettingsService.getSettings(cliente.id);
      if (data) setConfig(data);
    } catch (error) {
      toast.error('Erro ao carregar configurações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await clientSettingsService.saveSettings(cliente.id, config);
      toast.success('Configurações salvas!');
    } catch (error) {
      toast.error('Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClienteLayout>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Configurações</h1>
          <p className="text-slate-500 font-medium">Controle operacional da sua conta e do assistente.</p>
        </div>
        <button 
          onClick={handleSave}
          className="hidden md:flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl shadow-xl transition-all"
        >
          <Save size={20} />
          Salvar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Bot size={16} className="text-purple-400" />
              Inteligência Artificial
            </h3>
            
            <div className="space-y-4">
              <Toggle 
                enabled={config.responder_automatico}
                onChange={(v) => setConfig({...config, responder_automatico: v})}
                label="Automação Ativa"
                description="Permite que a IA responda mensagens automaticamente."
              />
              <Toggle 
                enabled={config.pausar_ia}
                onChange={(v) => setConfig({...config, pausar_ia: v})}
                label="Pausar IA Temporariamente"
                description="Interrompe todas as respostas da IA imediatamente."
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Bell size={16} className="text-blue-400" />
              Notificações de Sistema
            </h3>
            <Toggle 
              enabled={config.notificar_novas_mensagens}
              onChange={(v) => setConfig({...config, notificar_novas_mensagens: v})}
              label="Alertas de Novas Mensagens"
              description="Receba avisos quando um cliente iniciar uma conversa."
            />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
            <Clock size={16} className="text-cyan-400" />
            Horário de Funcionamento
          </h3>
          
          <div className="space-y-8">
            <Toggle 
              enabled={config.horario_atendimento_ativo}
              onChange={(v) => setConfig({...config, horario_atendimento_ativo: v})}
              label="Restringir por Horário"
              description="A IA só responderá dentro do intervalo definido."
            />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Início</label>
                <input 
                  type="time"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none"
                  value={config.horario_inicio}
                  onChange={(e) => setConfig({...config, horario_inicio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Término</label>
                <input 
                  type="time"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none"
                  value={config.horario_fim}
                  onChange={(e) => setConfig({...config, horario_fim: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mensagem de Ausência</label>
              <textarea 
                rows={4}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none resize-none"
                placeholder="Ex: Olá! No momento estamos fora do horário de atendimento. Retornaremos em breve."
                value={config.mensagem_ausencia}
                onChange={(e) => setConfig({...config, mensagem_ausencia: e.target.value})}
              />
            </div>
          </div>
        </div>

      </div>
    </ClienteLayout>
  );
}
