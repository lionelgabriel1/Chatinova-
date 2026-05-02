import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Sparkles, 
  MessageCircle, 
  Bot, 
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { supabase } from '../services/supabase';

import { useToast } from '../hooks/useToast';
import { logsService } from '../services/logsService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Rive / Teddy Setup
  const { rive, RiveComponent } = useRive({
    src: '/Teddy.flr', // Assuming the flr works with the runtime or user has it ready
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const isCheckingInput = useStateMachineInput(rive, "State Machine 1", "isChecking");
  const isHandsUpInput = useStateMachineInput(rive, "State Machine 1", "isHandsUp");
  const lookInput = useStateMachineInput(rive, "State Machine 1", "look");
  const successTrigger = useStateMachineInput(rive, "State Machine 1", "success");
  const failTrigger = useStateMachineInput(rive, "State Machine 1", "fail");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (lookInput) {
      lookInput.value = value.length * 2; // Simple look multiplier
    }
  };

  const handleEmailFocus = () => {
    if (isCheckingInput) isCheckingInput.value = true;
  };

  const handleEmailBlur = () => {
    if (isCheckingInput) isCheckingInput.value = false;
  };

  const handlePasswordFocus = () => {
    if (isHandsUpInput) isHandsUpInput.value = true;
  };

  const handlePasswordBlur = () => {
    if (isHandsUpInput) isHandsUpInput.value = false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      // 2. Verificar na tabela public.admins
      const { data: adminProfile, error: profileError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !adminProfile) {
        await supabase.auth.signOut();
        throw new Error('Você não tem permissão de acesso administrativo.');
      }

      if (adminProfile.status !== 'ativo') {
        await supabase.auth.signOut();
        throw new Error('Seu acesso administrativo está bloqueado.');
      }

      // 3. Atualizar último login
      await supabase
        .from('admins')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', data.user.id);

      if (successTrigger) successTrigger.fire();
      
      localStorage.setItem('admin_token', JSON.stringify({
        token: data.session.access_token,
        id: data.user.id,
        email: data.user.email,
        role: adminProfile.role,
        is_super_admin: adminProfile.is_super_admin
      }));

      // Criar log de login
      await logsService.createLog({
        tipo: 'login',
        nivel: 'success',
        titulo: 'Login Administrativo',
        descricao: `Admin ${email} acessou o painel`,
        usuario_tipo: 'admin',
        usuario_id: data.user.id,
        usuario_nome: adminProfile.nome,
        usuario_email: email
      });

      toast.success('Acesso autorizado! Bem-vindo de volta.', 'Olá, ' + adminProfile.nome);
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      if (failTrigger) failTrigger.fire();
      const msg = err.message || 'Falha na autenticação. Verifique suas credenciais.';
      setError(msg);
      toast.error(msg, 'Erro de Acesso');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center overflow-hidden font-sans">
      {/* Tech Eye Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 md:opacity-60 transition-opacity duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent 0%, #020617 80%), url('/assets/tech-eye-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(-10deg) brightness(0.8)'
        }}
      />

      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse transition-delay-700"></div>

      <div className="container mx-auto min-h-screen flex items-center justify-center px-6 py-12 z-10">
        <div className="grid md:grid-cols-2 w-full max-w-7xl gap-12 lg:gap-20 items-center">
          
          {/* LADO ESQUERDO: LOGIN */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center md:items-end order-2 md:order-1"
          >
            <div className="w-full max-w-[440px]">
              {/* Teddy Container */}
              <div className="h-56 w-full relative mb-[-60px] z-20 flex justify-center">
                <div className="w-72 h-72">
                   <RiveComponent />
                </div>
              </div>

              {/* Login Card */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 pt-16 relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Acesso Admin</h2>
                  <p className="text-slate-400 font-medium">Gerencie o ecossistema INOVACHAT</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                        <Mail size={22} />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={handleEmailChange}
                        onFocus={handleEmailFocus}
                        onBlur={handleEmailBlur}
                        placeholder="admin@inovachat.com"
                        className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-700 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                        <Lock size={22} />
                      </div>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-700 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm"
                      >
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Entrar no Painel</span>
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 flex justify-center">
                  <div className="flex items-center gap-2.5 text-slate-500 text-xs font-black uppercase tracking-widest">
                    <ShieldCheck size={18} className="text-purple-500" />
                    <span>Ambiente Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LADO DIREITO: BRANDING (Hidden on Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="hidden md:flex flex-col gap-10 order-1 md:order-2"
          >
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-[10px] font-black tracking-[0.2em] uppercase"
              >
                <Sparkles size={16} />
                <span>Next-Gen WhatsApp SaaS</span>
              </motion.div>
              
              <h1 className="text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                INOVA<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">CHAT</span>
              </h1>
              
              <p className="text-2xl text-slate-400 max-w-lg leading-relaxed font-light">
                Plataforma inteligente de atendimento via <span className="text-white font-medium">WhatsApp</span> impulsionada por IA para escalar seu negócio com eficiência.
              </p>
            </div>

            <div className="grid gap-5 mt-6">
              {[
                { icon: <Bot className="text-purple-400" size={24} />, title: "IA integrada com Groq", desc: "Processamento de linguagem natural ultra rápido e intuitivo." },
                { icon: <MessageCircle className="text-blue-400" size={24} />, title: "WhatsApp Gateway", desc: "Conexão de alta estabilidade e segurança via API oficial." },
                { icon: <ShieldCheck className="text-emerald-400" size={24} />, title: "Painel Administrativo", desc: "Controle total sobre clientes, planos e faturamento em tempo real." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 12, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl flex gap-5 items-start border border-white/5 hover:border-white/10 transition-all cursor-default"
                >
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl text-white font-bold mb-1.5">{item.title}</h4>
                    <p className="text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Branding */}
            <div className="mt-12 text-left">
              <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] font-black">
                Powered by Advanced Agentic AI • INOVACHAT v2.0
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
