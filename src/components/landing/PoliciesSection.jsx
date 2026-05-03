import React from 'react';
import { ShieldAlert, Fingerprint, Eye, Share2 } from 'lucide-react';

const PolicyCard = ({ icon: Icon, title, text }) => (
  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
      <Icon size={20} />
    </div>
    <h4 className="text-slate-900 font-bold mb-2 text-sm">{title}</h4>
    <p className="text-slate-600 text-xs leading-relaxed">{text}</p>
  </div>
);

const PoliciesSection = () => {
  return (
    <section id="politicas" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Privacidade de <span className="text-emerald-600">Dados</span></h2>
          <p className="text-slate-600 max-w-xl mx-auto font-medium text-sm">Resumo da nossa política sobre como tratamos suas informações.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PolicyCard 
            icon={Fingerprint}
            title="Dados Coletados"
            text="Coletamos nome, e-mail, telefone e CPF para gestão de conta e autenticação segura."
          />
          <PolicyCard 
            icon={Eye}
            title="Finalidade"
            text="Seus dados são usados exclusivamente para o funcionamento do painel e atendimento da IA."
          />
          <PolicyCard 
            icon={Share2}
            title="Compartilhamento"
            text="Seus dados nunca são vendidos. São integrados apenas com APIs essenciais (Groq/WhatsApp)."
          />
          <PolicyCard 
            icon={ShieldAlert}
            title="Segurança"
            text="Mantemos logs de acesso e auditoria para garantir a integridade da sua conta contra invasões."
          />
        </div>
      </div>
    </section>
  );
};

export default PoliciesSection;
