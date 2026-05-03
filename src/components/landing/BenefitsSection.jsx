import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Brain, Smartphone, Save, Zap, Users, LayoutDashboard, Settings } from 'lucide-react';

const BenefitCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="p-8 metallic-card-green hover:glow-green-premium transition-all duration-500 group relative shadow-2xl shadow-emerald-900/10"
  >
    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-600 transition-all duration-500 shadow-xl shadow-emerald-900/20 relative z-10 md:[filter:drop-shadow(0_0_8px_rgba(16,185,129,0.8))]">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-white mb-4 tracking-tight relative z-10 drop-shadow-md">{title}</h3>
    <p className="text-white/90 text-sm leading-relaxed font-medium relative z-10">{description}</p>
  </motion.div>
);

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Atendimento 24h",
      description: "Seus clientes nunca ficam sem resposta, mesmo nas madrugadas e finais de semana."
    },
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Configure a personalidade e o conhecimento da IA especificamente para o seu negócio."
    },
    {
      icon: Smartphone,
      title: "Conexão via WhatsApp",
      description: "Integração direta com o aplicativo que seus clientes já usam e amam."
    },
    {
      icon: Save,
      title: "Memória de Atendimento",
      description: "A IA lembra do histórico e das preferências de cada cliente para um papo humanizado."
    },
    {
      icon: Zap,
      title: "Respostas Rápidas",
      description: "Sem filas de espera. Respostas instantâneas para perguntas frequentes e suporte."
    },
    {
      icon: Users,
      title: "Organização de Clientes",
      description: "Mantenha todos os contatos e conversas organizados em um único painel profissional."
    },
    {
      icon: LayoutDashboard,
      title: "Painel Simples",
      description: "Interface intuitiva projetada para você gerenciar tudo sem precisar ser técnico."
    },
    {
      icon: Settings,
      title: "Automação sem Complicação",
      description: "Conecte seu WhatsApp, configure sua IA e deixe o sistema trabalhar por você."
    }
  ];

  return (
    <section id="beneficios" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
          Por que escolher o <span className="text-emerald-600">InovaChat?</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto font-medium">
          Tecnologia de ponta para empresas que buscam escalar o atendimento sem perder a qualidade.
        </p>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <BenefitCard 
            key={index}
            {...benefit}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
