import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, Server, Key, Database } from 'lucide-react';

const SecurityItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-slate-900 font-bold mb-1">{title}</h4>
      <p className="text-slate-600 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

const SecuritySection = () => {
  return (
    <section id="seguranca" className="py-20 lg:py-32 relative overflow-hidden bg-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-8 text-emerald-700 font-bold">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Segurança Enterprise</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-8 uppercase">
            Seus dados estão <br /> <span className="text-emerald-600">Sempre Protegidos</span>
          </h2>
          
          <p className="text-slate-600 font-medium leading-relaxed mb-12">
            O InovaChat utiliza os mais altos padrões de segurança para garantir que sua operação e as conversas com seus clientes permaneçam privadas e seguras.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SecurityItem 
              icon={Lock} 
              title="Backend Protegido" 
              description="Nossas chaves de API nunca são expostas ao navegador do usuário."
            />
            <SecurityItem 
              icon={EyeOff} 
              title="Isolamento de Dados" 
              description="Cada cliente possui um ambiente isolado. Seus dados são só seus."
            />
            <SecurityItem 
              icon={Key} 
              title="Sessões Seguras" 
              description="Autenticação moderna com controle rigoroso de status de conta."
            />
            <SecurityItem 
              icon={Database} 
              title="Sem Exposição Direta" 
              description="Toda a comunicação com o WhatsApp passa por camadas de proxy."
            />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative metallic-card-green glow-green-premium rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl will-change-transform"
        >
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-8 relative md:[filter:drop-shadow(0_0_15px_rgba(16,185,129,0.8))]">
            <ShieldCheck size={64} className="text-white" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500/10 rounded-full"
            />
          </div>
          <h3 className="text-2xl font-black text-white mb-4">Certificação de Segurança</h3>
          <p className="text-white/90 text-sm max-w-xs mx-auto">
            Utilizamos infraestrutura escalável com monitoramento 24/7 contra ameaças externas.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-white" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">100% Protegido</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;
