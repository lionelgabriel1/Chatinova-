import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Save, MessageSquare, Mail, Layout } from 'lucide-react';

export default function ConfigNotificacoes({ data, onUpdate }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: data || {
      welcome_message: '',
      expiration_message: '',
      suspension_message: '',
      notify_3_days: true,
      notify_channels: ['painel', 'whatsapp']
    }
  });

  useEffect(() => {
    reset(data || {});
  }, [data, reset]);

  const onSubmit = async (values) => {
    await onUpdate('notificacoes', values);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
          <Bell size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Notificações</h2>
          <p className="text-xs text-slate-500">Réguas de cobrança e alertas automáticos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mensagem de Boas-vindas</label>
           <textarea 
             {...register('welcome_message')}
             rows={3}
             className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 resize-none"
           />
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mensagem de Vencimento (Aviso)</label>
           <textarea 
             {...register('expiration_message')}
             rows={3}
             className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 resize-none"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                 <Layout size={16} /> <span className="text-xs font-bold">Painel</span>
              </div>
              <input type="checkbox" value="painel" {...register('notify_channels')} className="w-4 h-4 accent-blue-600" />
           </div>
           <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                 <MessageSquare size={16} /> <span className="text-xs font-bold">WhatsApp</span>
              </div>
              <input type="checkbox" value="whatsapp" {...register('notify_channels')} className="w-4 h-4 accent-blue-600" />
           </div>
           <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                 <Mail size={16} /> <span className="text-xs font-bold">Email</span>
              </div>
              <input type="checkbox" value="email" {...register('notify_channels')} className="w-4 h-4 accent-blue-600" />
           </div>
        </div>

        <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
           <Save size={18} /> Salvar Réguas
        </button>
      </form>
    </div>
  );
}
