import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, KeyRound, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';

export default function MaintenanceGate() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const isValid = await maintenanceService.verifyPassword(password);
      if (isValid) {
        maintenanceService.setUnlocked(true);
        window.location.reload(); // Recarregar para liberar rotas
      } else {
        setError('Senha de acesso inválida');
      }
    } catch (err) {
      setError('Erro ao verificar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glass Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative group">
          {/* Neon Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-20 blur-[2px]"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo/Icon */}
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 relative">
              <ShieldAlert className="text-blue-500" size={40} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl"
              ></motion.div>
            </div>

            <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
              Sistema em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Manutenção</span>
            </h1>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-10 px-4">
              Estamos realizando ajustes técnicos para melhorar sua experiência. 
              O acesso está restrito a desenvolvedores e administradores autorizados.
            </p>

            <form onSubmit={handleVerify} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-rose-500 text-xs font-medium bg-rose-500/5 p-3 rounded-xl border border-rose-500/10"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            INOVACHAT v1.2 &bull; Secure Maintenance Gate
          </p>
        </div>
      </motion.div>
    </div>
  );
}
