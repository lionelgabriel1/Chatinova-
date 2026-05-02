import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/client/AuthLayout';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';
import { logsService } from '../../services/logsService';

export default function LoginCliente() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cliente = await clientAuthService.loginCliente(formData.email, formData.password);
      
      // Criar log de login
      await logsService.createLog({
        tipo: 'login',
        nivel: 'success',
        titulo: 'Login de Cliente',
        descricao: `Cliente ${formData.email} acessou o painel`,
        usuario_tipo: 'cliente',
        usuario_id: cliente.id,
        usuario_nome: cliente.nome,
        usuario_email: cliente.email
      });

      toast.success('Acesso autorizado! Bem-vindo ao seu painel.');
      navigate('/cliente/dashboard');
    } catch (error) {
      toast.error(error.message || 'Falha ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[60px] group-hover:bg-purple-600/30 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Bem-vindo</h2>
              <p className="text-slate-400 text-sm">Acesse seu painel inteligente</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="exemplo@empresa.com"
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Senha de Acesso</label>
                <Link to="/esqueci-senha" title="Recuperar acesso" className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                  Esqueci a senha
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn overflow-hidden relative"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="relative z-10">Entrar no Painel</span>
                  <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem uma conta?{' '}
              <Link to="/cadastro" className="text-white font-bold hover:text-purple-400 transition-colors">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
