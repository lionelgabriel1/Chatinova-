import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, CreditCard, ArrowRight, ShieldCheck, Check, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/client/AuthLayout';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';

export default function CadastroCliente() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  });

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const steps = [
    { 
      id: 'nome', 
      label: 'Qual o seu nome completo?', 
      icon: User, 
      fields: ['nomeCompleto'],
      description: 'Diga-nos como quer ser chamado no painel.'
    },
    { 
      id: 'email', 
      label: 'Qual seu melhor e-mail?', 
      icon: Mail, 
      fields: ['email'],
      type: 'email',
      description: 'Este será seu login de acesso principal.'
    },
    { 
      id: 'whatsapp', 
      label: 'Seu WhatsApp para contato?', 
      icon: Phone, 
      fields: ['telefone'],
      description: 'Enviaremos a confirmação de aprovação por aqui.'
    },
    { 
      id: 'cpf', 
      label: 'Informe seu CPF', 
      icon: CreditCard, 
      fields: ['cpf'],
      description: 'Necessário para emissão de notas e segurança.'
    },
    { 
      id: 'senha', 
      label: 'Crie uma senha segura', 
      icon: Lock, 
      fields: ['senha'],
      type: 'password',
      description: 'Mínimo de 6 caracteres com letras e números.'
    },
    { 
      id: 'confirmar', 
      label: 'Confirme sua senha', 
      icon: ShieldCheck, 
      fields: ['confirmarSenha'],
      type: 'password',
      description: 'Repita a senha para garantir que está correta.'
    }
  ];

  const handleNext = (e) => {
    if (e) e.preventDefault();
    
    // Validação simples do passo atual
    const currentFields = steps[currentStep].fields;
    for (const field of currentFields) {
      if (!formData[field]) {
        toast.error('Por favor, preencha o campo antes de continuar.');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };


  const handleSubmit = async () => {
    if (formData.senha !== formData.confirmarSenha) {
      return toast.error('As senhas não coincidem.');
    }

    setLoading(true);
    try {
      const { confirmarSenha, nomeCompleto, ...rest } = formData;
      const parts = nomeCompleto.trim().split(' ');
      const nome = parts[0];
      const sobrenome = parts.slice(1).join(' ') || '';

      const cadastroData = {
        ...rest,
        nome,
        sobrenome
      };

      await clientAuthService.cadastrarCliente(cadastroData);
      setSuccess(true);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl mx-auto bg-slate-900 border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <Check size={48} strokeWidth={3} />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Solicitação Enviada!</h2>
          
          <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-8">
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              Sua conta foi criada e será aprovada em até <span className="text-white font-bold">2 horas</span>.
            </p>
            <div className="w-full h-px bg-white/10 my-4" />
            <div className="flex items-center justify-center gap-3 text-emerald-400">
              <Phone size={20} />
              <span className="font-bold">Você será informado via WhatsApp</span>
            </div>
          </div>

          <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
            Voltar para Início
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <AuthLayout>
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Passo {currentStep + 1} de {steps.length}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{Math.round(((currentStep + 1) / steps.length) * 100)}% Completo</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
            />
          </div>
        </div>

        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl relative"
        >
          {/* Decorative blur */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20">
              <StepIcon size={32} />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter leading-tight">
              {steps[currentStep].label}
            </h2>
            <p className="text-slate-400 font-medium mb-10">{steps[currentStep].description}</p>

            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  {steps[currentStep].id === 'confirmar' ? 'Confirme a senha' : steps[currentStep].label.replace('?', '')}
                </label>
                <input 
                  autoFocus
                  type={steps[currentStep].type || 'text'}
                  required
                  placeholder={
                    steps[currentStep].id === 'nome' ? 'Nome e sobrenome' :
                    steps[currentStep].id === 'email' ? 'seu@email.com' :
                    steps[currentStep].id === 'whatsapp' ? '(00) 00000-0000' :
                    steps[currentStep].id === 'cpf' ? '000.000.000-00' :
                    '••••••••'
                  }
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-lg"
                  value={formData[steps[currentStep].fields[0]]}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (steps[currentStep].id === 'whatsapp') val = maskPhone(val);
                    if (steps[currentStep].id === 'cpf') val = maskCPF(val);
                    setFormData({...formData, [steps[currentStep].fields[0]]: val});
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-4 pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{currentStep === steps.length - 1 ? 'Finalizar Cadastro' : 'Continuar'}</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Já possui acesso?{' '}
            <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors border-b border-white/10">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
