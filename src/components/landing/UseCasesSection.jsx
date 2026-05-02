import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Stethoscope, ShoppingBag, Briefcase, Truck, Globe, Megaphone, Headset } from 'lucide-react';

const CaseCard = ({ icon: Icon, title }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className="
      metallic-card-green
      group transition-all duration-500
      p-8
      min-h-[220px]
      flex flex-col items-center justify-center text-center
      hover:glow-green-premium
      shadow-xl shadow-emerald-900/10
    "
  >
    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all mb-6 relative z-10 shadow-lg shadow-emerald-900/20 md:[filter:drop-shadow(0_0_8px_rgba(16,185,129,0.8))]">
      <Icon size={32} />
    </div>
    <h4 className="text-white font-black uppercase tracking-widest text-xs leading-tight max-w-[150px] relative z-10 drop-shadow-md">
      {title}
    </h4>
  </motion.div>
);

const UseCasesSection = () => {
  const cases = [
    { icon: Scissors, title: "Salões de Beleza" },
    { icon: Stethoscope, title: "Clínicas Médicas" },
    { icon: ShoppingBag, title: "Lojas Online" },
    { icon: Briefcase, title: "Profissionais Liberais" },
    { icon: Truck, title: "Delivery / Comida" },
    { icon: Globe, title: "Infoprodutores" },
    { icon: Megaphone, title: "Agências de Marketing" },
    { icon: Headset, title: "Suporte ao Cliente" }
  ];

  return (
    <section id="como-funciona" className="relative overflow-hidden bg-white px-5 py-20 lg:py-32">
      {/* Decorative background element - Light Mode */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 blur-[120px] rounded-full -z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
            Feito para <span className="text-emerald-600">Qualquer Negócio</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-medium text-sm md:text-base">
            A IA se adapta ao seu nicho, aprendendo as nuances do seu mercado para um atendimento impecável.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, index) => (
            <CaseCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
