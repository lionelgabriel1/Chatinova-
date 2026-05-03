import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, QrCode, BrainCircuit, MessageCircle } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description, isLast }) => (
  <div className="flex flex-col items-center text-center relative">
    {!isLast && (
      <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-emerald-600/30 to-transparent -z-10" />
    )}
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-900/20 mb-8 relative"
    >
      <Icon size={36} />
      <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm">
        {number}
      </div>
    </motion.div>
    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed font-medium px-4">{description}</p>
  </div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Crie sua conta",
      description: "Cadastre-se em segundos para ter acesso ao seu painel exclusivo."
    },
    {
      icon: QrCode,
      title: "Conecte seu WhatsApp",
      description: "Escaneie o QR Code para integrar seu número com nossa plataforma."
    },
    {
      icon: BrainCircuit,
      title: "Configure a Memória",
      description: "Ensine à IA tudo sobre seu negócio, produtos e tom de voz."
    },
    {
      icon: MessageCircle,
      title: "Pronto para rodar",
      description: "Sua IA começa a responder automaticamente seguindo suas regras."
    }
  ];

  return (
    <section id="como-funciona" className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-6 text-center mb-24">
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
          Comece em <span className="text-emerald-600">4 Passos Simples</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto font-medium">
          Sem códigos complexos ou configurações demoradas. O InovaChat foi feito para ser fácil.
        </p>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {steps.map((step, index) => (
          <Step 
            key={index}
            number={index + 1}
            {...step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
