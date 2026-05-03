import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Zap, Shield, Sparkles } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import TestAICTA from './TestAICTA';

const HeroSection = () => {
  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-grid">
      {/* Background Blobs - Light Mode Subtle */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100 blur-[120px] rounded-full -z-10 animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-50 blur-[100px] rounded-full -z-10 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-8">
            <Sparkles size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Inteligência Artificial de Ponta</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
            Atendimento inteligente no <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">WhatsApp com IA</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl">
            Automatize conversas, responda clientes em tempo real e transforme seu WhatsApp em um assistente comercial disponível 24 horas por dia.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link to="/cadastro" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all text-center">
              Começar agora
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-slate-100 border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all text-center">
              Já tenho conta
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-widest">
              <Zap size={14} className="text-emerald-600" />
              Rápido
            </div>
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-widest">
              <Shield size={14} className="text-emerald-600" />
              Seguro
            </div>
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-widest">
              <MessageSquare size={14} className="text-emerald-600" />
              Escalável
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex flex-col items-center justify-center"
        >
          <TestAICTA />
          <PhoneMockup />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
