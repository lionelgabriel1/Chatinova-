import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-700 group-hover:text-emerald-500'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 text-sm leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      question: "O InovaChat funciona com qualquer número de WhatsApp?",
      answer: "Sim! Você pode conectar qualquer número de WhatsApp (Pessoal ou Business) através do nosso sistema de QR Code simples."
    },
    {
      question: "Preciso baixar algum aplicativo no computador?",
      answer: "Não. O InovaChat é 100% online (SaaS). Você gerencia tudo pelo seu navegador, de qualquer lugar."
    },
    {
      question: "Como a IA sabe as informações da minha empresa?",
      answer: "Você preenche a 'Memória da IA' no painel do cliente com seus dados, serviços e regras. A IA usa esses dados para responder."
    },
    {
      question: "A IA responde os clientes automaticamente mesmo se eu estiver offline?",
      answer: "Exatamente. O servidor processa as mensagens 24 horas por dia, independente do seu computador estar ligado."
    },
    {
      question: "Meus clientes vão saber que estão falando com uma IA?",
      answer: "Depende de como você configurar. A IA é extremamente avançada e natural, mas você pode definir um tom mais robótico ou humanizado."
    },
    {
      question: "Posso pausar a automação a qualquer momento?",
      answer: "Sim. No seu painel existe um botão central para ligar ou desligar a IA instantaneamente."
    },
    {
      question: "O que acontece se eu esquecer de renovar meu plano?",
      answer: "O sistema pausa automaticamente as respostas e envia uma notificação. Seus dados ficam salvos por um período para você renovar."
    },
    {
      question: "Onde faço login para ver as conversas?",
      answer: "Basta clicar no botão 'Entrar' no topo da página e usar suas credenciais cadastradas."
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            <HelpCircle size={14} />
            Dúvidas Frequentes
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase">Perguntas <span className="text-emerald-600">Comuns</span></h2>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
          {faqs.map((faq, i) => (
            <FaqItem key={i} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
