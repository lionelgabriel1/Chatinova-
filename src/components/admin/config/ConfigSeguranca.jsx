import React from 'react';
import { Shield, Save, Lock, Smartphone, List } from 'lucide-react';

export default function ConfigSeguranca({ data, onUpdate }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Segurança</h2>
          <p className="text-xs text-slate-500">Proteção de acesso e políticas do administrador</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
               <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock size={16} className="text-blue-400" /> Alterar Senha
               </h3>
               <input type="password" placeholder="Senha Atual" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-white" />
               <input type="password" placeholder="Nova Senha" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-white" />
               <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">Atualizar Senha</button>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
               <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone size={16} className="text-emerald-400" /> Autenticação 2FA
               </h3>
               <p className="text-xs text-slate-500">Aumente a segurança exigindo um código de verificação no login.</p>
               <button className="w-full py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-600/20 transition-all">Configurar 2FA</button>
            </div>
         </div>
      </div>
    </div>
  );
}
