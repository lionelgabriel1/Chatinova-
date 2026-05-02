import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Layout, QrCode, Brain, MessageSquare, Database, Bell, Activity, Settings, Shield } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="flex gap-6 p-8 metallic-card-green hover:glow-green-premium transition-all duration-500 group shadow-xl shadow-emerald-900/10"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg shadow-emerald-900/20 relative z-10 md:[filter:drop-shadow(0_0_8px_rgba(16,185,129,0.8))]">
      <Icon size={24} />
    </div>
    <div className="relative z-10">
      <h4 className="text-white font-bold mb-2 tracking-tight drop-shadow-md">{title}</h4>
      <p className="text-white/90 text-xs leading-relaxed font-medium">{description}</p>
    </div>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Layout,
      title: "Painel do Cliente",
      description: "Interface completa para gerenciar toda a sua operação de IA."
    },
    {
      icon: QrCode,
      title: "QR Code Instantâneo",
      description: "Conexão simplificada com seu WhatsApp via tecnologia gateway."
    },
    {
      icon: Brain,
      title: "Memória da IA",
      description: "Configure o cérebro do assistente com dados reais da sua empresa."
    },
    {
      icon: MessageSquare,
      title: "Mensagem Inicial",
      description: "Defina saudações personalizadas para cada novo contato."
    },
    {
      icon: Database,
      title: "Coleta de Dados",
      description: "A IA identifica nomes, e-mails e necessidades automaticamente."
    },
    {
      icon: Database,
      title: "Histórico Completo",
      description: "Acesse todas as conversas e respostas geradas pela IA."
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Alertas em tempo real sobre novas mensagens e status."
    },
    {
      icon: Activity,
      title: "Status de Conexão",
      description: "Monitoramento em tempo real da saúde do seu WhatsApp."
    },
    {
      icon: Settings,
      title: "Controle Total",
      description: "Pause, reinicie ou altere configurações quando quiser."
    },
    {
      icon: Shield,
      title: "Segurança de Dados",
      description: "Seus dados e de seus clientes protegidos por criptografia."
    }
  ];

  return (
    <section id="recursos" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
          Recursos <span className="text-emerald-600">Poderosos</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto font-medium">
          Tudo o que você precisa para automatizar seu atendimento em escala global.
        </p>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureItem 
            key={index}
            {...feature}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
