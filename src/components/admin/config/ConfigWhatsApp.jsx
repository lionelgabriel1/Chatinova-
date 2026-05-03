import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Save, Zap, Link2, Key, Globe } from 'lucide-react';

export default function ConfigWhatsApp({ data, onUpdate }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: data || {
      evolution_url: '',
      evolution_key: '',
      webhook_url: '',
      send_timeout: 30
    }
  });

  useEffect(() => {
    reset(data || {});
  }, [data, reset]);

  const onSubmit = async (values) => {
    await onUpdate('gateway_whatsapp', values);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <MessageSquare size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">WhatsApp Gateway</h2>
          <p className="text-xs text-slate-500">Conexão com a Evolution API / INOVACHAT Gateway</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">URL da API</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                {...register('evolution_url')}
                placeholder="https://api.gateway.com"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password"
                {...register('evolution_key')}
                placeholder="sk_..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Webhook URL</label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                {...register('webhook_url')}
                placeholder="https://seu-painel.com/api/webhooks"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Timeout Envio (seg)</label>
            <input 
              type="number"
              {...register('send_timeout')}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
              <Save size={18} /> Salvar Gateway
           </button>
           <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
              <Zap size={18} /> Testar Conexão
           </button>
        </div>
      </form>
    </div>
  );
}
