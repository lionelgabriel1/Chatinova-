import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Lock, Save, LogOut, Eye, EyeOff, Key } from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientAuthService } from '../../services/clientAuthService';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';

export default function PerfilCliente() {
  const toast = useToast();
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: ''
  });
  const [saving, setSaving] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    novaSenha: '',
    confirmarSenha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadCliente() {
      const data = await clientAuthService.getClienteLogado();
      setCliente(data);
      if (data) {
        setFormData({
          nome: data.nome || '',
          sobrenome: data.sobrenome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          cpf: data.cpf || ''
        });
      }
    }
    loadCliente();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/client/profile', {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        telefone: formData.telefone
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.novaSenha.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setChangingPassword(true);
    try {
      const response = await api.put('/api/client/change-password', {
        novaSenha: passwordData.novaSenha
      });
      if (response.data.success) {
        toast.success('Senha alterada com sucesso!');
        setShowChangePassword(false);
        setPasswordData({ novaSenha: '', confirmarSenha: '' });
      }
    } catch (error) {
      toast.error('Erro ao alterar senha: ' + (error.response?.data?.error || error.message));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <ClienteLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Meu Perfil</h1>
        <p className="text-slate-500 font-medium">Gerencie suas informações pessoais e de acesso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <User size={16} className="text-blue-400" />
              Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sobrenome</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  value={formData.sobrenome}
                  onChange={(e) => setFormData({...formData, sobrenome: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                <input
                  type="email"
                  disabled
                  className="w-full bg-slate-800/30 border border-white/5 rounded-2xl py-4 px-6 text-slate-500 cursor-not-allowed"
                  value={formData.email}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telefone</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CPF</label>
                <input
                  disabled
                  className="w-full bg-slate-800/30 border border-white/5 rounded-2xl py-4 px-6 text-slate-500 cursor-not-allowed"
                  value={formData.cpf}
                />
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Lock size={16} className="text-purple-400" />
              Segurança
            </h3>

            {showChangePassword ? (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        value={passwordData.novaSenha}
                        onChange={(e) => setPasswordData({...passwordData, novaSenha: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-500 hover:text-white">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                      value={passwordData.confirmarSenha}
                      onChange={(e) => setPasswordData({...passwordData, confirmarSenha: e.target.value})}
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
                  >
                    {changingPassword ? 'Salvando...' : 'Confirmar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Mantenha sua conta segura alterando sua senha periodicamente.
                </p>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Key size={18} />
                  Alterar Senha
                </button>
              </div>
            )}
          </div>

          <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-8">
            <h3 className="text-rose-500 font-black uppercase tracking-widest text-xs mb-4">Zona de Risco</h3>
            <button
              onClick={() => clientAuthService.logoutCliente()}
              className="flex items-center justify-center gap-3 w-full py-4 text-rose-500 font-black rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
            >
              <LogOut size={20} />
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
