import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="metallic-card-green glow-green-premium rounded-[3.5rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20 will-change-transform">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-inner">
              <Zap size={32} />
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6 leading-none drop-shadow-md">
              Pronto para automatizar <br className="hidden lg:block" /> seu atendimento?
            </h2>
            <p className="text-emerald-50 text-lg lg:text-xl font-medium max-w-2xl mx-auto mb-12">
              Crie sua conta agora e configure sua primeira inteligência artificial para começar a atender melhor seus clientes em poucos minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/cadastro" className="group w-full sm:w-auto px-12 py-5 bg-white text-emerald-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                Criar cadastro
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-12 py-5 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
                Entrar no painel
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
