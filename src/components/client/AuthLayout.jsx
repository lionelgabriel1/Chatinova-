import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
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

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Institutional Content (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col flex-1 text-left"
        >
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">
            INOVA<span className="text-purple-500">CHAT</span>
          </h1>
          <p className="text-2xl text-blue-400 font-bold mb-4">
            Sua IA atendendo seus clientes 24h no WhatsApp.
          </p>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Escale seu atendimento com inteligência artificial de última geração e gestão simplificada de instâncias.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="text-white font-bold">+500 empresas</span> já utilizam
            </p>
          </div>
        </motion.div>

        {/* Card Auth Container */}
        <div className="w-full max-w-[480px]">
          {children}
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] font-black">
          Powered by Advanced Agentic AI • INOVACHAT v2.0
        </p>
      </div>
    </div>
  );
}
