import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bot, Save, Zap, Cpu, Clock, Sliders, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function ConfigIA({ data, onUpdate }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: data || {
      modelo: 'llama-3.3-70b-versatile',
      temperatura: 0.7,
      max_tokens: 1000,
      ia_ativa: true,
      timeout: 30
    }
  });

  const temp = watch('temperatura');

  useEffect(() => {
    reset(data || {});
  }, [data, reset]);

  const onSubmit = async (values) => {
    await onUpdate('ia_groq', values);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await adminService.testGroq();
      setTestResult({
        status: result.success ? 'online' : 'offline',
        message: result.message || (result.success ? 'Conexão estável.' : 'Erro na resposta.')
      });
    } catch (e) {
      setTestResult({ 
        status: 'offline', 
        message: e.response?.data?.error || 'Erro ao conectar com o servidor.' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Inteligência Artificial (Groq)</h2>
          <p className="text-xs text-slate-500">Configure o cérebro das automações do INOVACHAT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Modelo Groq</label>
                <select 
                  {...register('modelo')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Recomendado)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B (Rápido)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Temperatura</label>
                  <span className="text-xs font-bold text-blue-400">{temp}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  {...register('temperatura', { valueAsNumber: true })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Max Tokens</label>
                <input 
                  type="number"
                  {...register('max_tokens', { valueAsNumber: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Timeout (Segundos)</label>
                <input 
                  type="number"
                  {...register('timeout', { valueAsNumber: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Prompt Global Padrão</label>
              <textarea 
                {...register('prompt_global')}
                rows={4}
                placeholder="Você é um assistente virtual..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="flex-1">
                   <h4 className="text-sm font-bold text-white">Ativar IA Globalmente</h4>
                   <p className="text-xs text-slate-500">Se desativado, nenhum bot responderá aos clientes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('ia_ativa')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                <Save size={18} />
                Salvar IA
              </button>
              <button 
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
              >
                {testing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                Testar Conexão
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
           <div className={`p-6 rounded-2xl border transition-all ${
             testResult?.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/20' : 
             testResult?.status === 'offline' ? 'bg-red-500/10 border-red-500/20' :
             'bg-slate-900/40 border-slate-800'
           }`}>
              <div className="flex items-center gap-2 mb-4">
                 <Cpu size={16} className="text-purple-400" />
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Status da IA</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${testResult?.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                 <span className={`text-xl font-bold ${testResult?.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {testResult?.status?.toUpperCase() || 'AGUARDANDO'}
                 </span>
              </div>
              {testResult?.message && (
                <p className="text-[10px] text-slate-400 mt-2">{testResult.message}</p>
              )}
           </div>

           <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 mb-4 text-slate-500">
                 <Clock size={16} />
                 <span className="text-xs font-bold uppercase tracking-wider">Último Teste</span>
              </div>
              <p className="text-sm font-bold text-white">Hoje às 12:45</p>
           </div>
        </div>
      </div>
    </div>
  );
}
