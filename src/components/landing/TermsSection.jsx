import React from 'react';
import { ScrollText, CheckCircle2 } from 'lucide-react';

const TermsSection = () => {
  const terms = [
    "Responsabilidade pelas mensagens enviadas pelo cliente.",
    "Proibição estrita de práticas de SPAM ou mensagens em massa não autorizadas.",
    "Proibição de uso da plataforma para atividades ilegais ou abusivas.",
    "O serviço depende da estabilidade de APIs externas (WhatsApp/Groq).",
    "Possibilidade de suspensão da conta em caso de violação dos termos.",
    "Direito do InovaChat realizar manutenções programadas no sistema."
  ];

  return (
    <section id="termos" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 lg:p-16 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="lg:w-1/3">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                <ScrollText size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Termos de <br /> <span className="text-emerald-600">Uso do Serviço</span></h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                Nossos termos foram criados para garantir uma experiência segura e produtiva para todos os usuários da plataforma.
              </p>
              <a href="mailto:suporte@inovachat.com" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-500 transition-colors">
                Entrar em contato sobre os termos
              </a>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {terms.map((term, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">{term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
