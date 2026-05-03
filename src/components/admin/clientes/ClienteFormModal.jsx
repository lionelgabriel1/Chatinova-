import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save, User, Mail, Phone, Hash, Calendar, Shield, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { planosService } from '../../../services/planosService';
import { useToast } from '../../../hooks/useToast';

const clientSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sobrenome: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').optional(),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  plano_id: z.string().min(1, 'Selecione um plano'),
  plano_vencimento: z.string().min(1, 'Vencimento é obrigatório'),
  status: z.string().default('ativo'),
});

export default function ClienteFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const toast = useToast();
  const [planos, setPlanos] = useState([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: 'ativo'
    }
  });

  const selectedPlanoId = watch('plano_id');

  useEffect(() => {
    if (isOpen) {
      fetchPlanos();
    }
  }, [isOpen]);

  const fetchPlanos = async () => {
    setLoadingPlanos(true);
    try {
      const data = await planosService.getPlanosAtivos();
      setPlanos(data);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar planos. Verifique a conexão.');
    } finally {
      setLoadingPlanos(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        senha: '', 
        plano_vencimento: initialData.plano_vencimento ? new Date(initialData.plano_vencimento).toISOString().split('T')[0] : ''
      });
    } else {
      reset({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        cpf: '',
        senha: '',
        plano_id: '',
        plano_vencimento: '',
        status: 'ativo'
      });
    }
  }, [initialData, reset, isOpen]);

  // Sincronizar plano_nome quando plano_id mudar
  useEffect(() => {
     if (selectedPlanoId && planos.length > 0) {
        const p = planos.find(p => p.id === selectedPlanoId);
        if (p) {
           // Podemos salvar plano_nome se o backend/service esperar
        }
     }
  }, [selectedPlanoId, planos]);

  const handleFormSubmit = async (data) => {
    const plano = planos.find(p => p.id === data.plano_id);
    const finalData = {
      ...data,
      plano_nome: plano?.nome || ''
    };
    await onSubmit(finalData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">
              {initialData ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('nome')}
                    placeholder="João"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                {errors.nome && <p className="text-[10px] text-red-400 font-medium ml-1">{errors.nome.message}</p>}
              </div>

              {/* Sobrenome */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Sobrenome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('sobrenome')}
                    placeholder="Silva"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="joao@exemplo.com"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-400 font-medium ml-1">{errors.email.message}</p>}
              </div>

              {/* Plano */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Plano Assinado</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select
                    {...register('plano_id')}
                    disabled={loadingPlanos}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="">{loadingPlanos ? 'Carregando planos...' : 'Selecione um plano'}</option>
                    {planos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco}</option>
                    ))}
                  </select>
                  {loadingPlanos && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500" size={16} />}
                </div>
                {errors.plano_id && <p className="text-[10px] text-red-400 font-medium ml-1">{errors.plano_id.message}</p>}
                {planos.length === 0 && !loadingPlanos && <p className="text-[10px] text-orange-400 font-medium ml-1">Nenhum plano ativo cadastrado.</p>}
              </div>

              {/* CPF */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">CPF</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Vencimento */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vencimento do Plano</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('plano_vencimento')}
                    type="date"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                {errors.plano_vencimento && <p className="text-[10px] text-red-400 font-medium ml-1">{errors.plano_vencimento.message}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  {initialData ? 'Nova Senha (deixe vazio para manter)' : 'Senha de Acesso'}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    {...register('senha')}
                    type="password"
                    placeholder="******"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-500 ml-1 mt-1 italic">Dica: A senha será processada de forma segura.</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (planos.length === 0 && !initialData)}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Atualizar Cliente' : 'Criar Cliente'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
