import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Save, Sparkles, MessageSquare, Shield, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { clientAiMemoryService } from '../../services/clientAiMemoryService';
import { useToast } from '../../hooks/useToast';

export default function MemoriaIACliente() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testPergunta, setTestPergunta] = useState('');
  const [testResposta, setTestResposta] = useState('');
  
  const [formData, setFormData] = useState({
    nome_empresa: '',
    nicho: '',
    descricao_empresa: '',
    mensagem_inicial: '',
    tom_atendimento: 'profissional',
    regras_ia: '',
    prompt_personalizado: '',
    dados_coletar: {}
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clientAiMemoryService.getMyMemory();
      if (data.memory) {
        setFormData(data.memory);
      }
    } catch (error) {
      console.error(error);
      toast.error('Falha ao carregar memória da IA.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validate = () => {
    if (!formData.nome_empresa) { toast.error('Nome da empresa é obrigatório.'); return false; }
    if (!formData.nicho) { toast.error('Nicho/Ramo é obrigatório.'); return false; }
    if (!formData.tom_atendimento) { toast.error('Tom de atendimento é obrigatório.'); return false; }
    if (!formData.mensagem_inicial) { toast.error('Mensagem inicial é obrigatória.'); return false; }
    return true;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await clientAiMemoryService.saveMemory(formData);
      toast.success('Memória da IA salva e ativada com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar memória da IA.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testPergunta) return;
    setTesting(true);
    setTestResposta('');
    try {
      const data = await clientAiMemoryService.testAI(testPergunta, formData);
      setTestResposta(data.response);
    } catch (error) {
      toast.error('Erro ao testar IA.');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <ClienteLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 size={48} className="text-purple-500 animate-spin" />
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BrainCircuit className="text-purple-500" size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">MEMÓRIA IA<span className="text-purple-500">.</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Configure o cérebro do seu robô para um atendimento humano e eficiente.</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                IA Ativa
            </span>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Salvar Memória
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulário Col 1 & 2 */}
        <div className="xl:col-span-2 space-y-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-10">
                    <Shield className="text-blue-400" size={20} />
                    <h3 className="text-white font-black uppercase tracking-widest text-xs">Identidade & Ramo</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Empresa</label>
                        <input 
                            className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
                            value={formData.nome_empresa}
                            onChange={(e) => setFormData({...formData, nome_empresa: e.target.value})}
                            placeholder="Ex: InovaTech Soluções"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nicho / Especialidade</label>
                        <input 
                            className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
                            value={formData.nicho}
                            onChange={(e) => setFormData({...formData, nicho: e.target.value})}
                            placeholder="Ex: Consultoria em Marketing"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tom de Atendimento</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['profissional', 'amigavel', 'vendedor', 'formal'].map((tom) => (
                                <button
                                    key={tom}
                                    type="button"
                                    onClick={() => setFormData({...formData, tom_atendimento: tom})}
                                    className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.tom_atendimento === tom ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-slate-800/40 border-white/5 text-slate-500 hover:border-white/10'}`}
                                >
                                    {tom}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-10">
                    <Sparkles className="text-cyan-400" size={20} />
                    <h3 className="text-white font-black uppercase tracking-widest text-xs">Conhecimento Profundo</h3>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição / FAQ da Empresa</label>
                        <textarea 
                            rows={6}
                            className="w-full bg-slate-800/40 border border-white/5 rounded-[2.5rem] py-6 px-8 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm leading-relaxed"
                            value={formData.descricao_empresa}
                            onChange={(e) => setFormData({...formData, descricao_empresa: e.target.value})}
                            placeholder="Descreva o que sua empresa faz, produtos, preços, horários, localização... Tudo o que a IA deve saber para responder aos clientes."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mensagem Inicial (WhatsApp)</label>
                            <textarea 
                                rows={4}
                                className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm"
                                value={formData.mensagem_inicial}
                                onChange={(e) => setFormData({...formData, mensagem_inicial: e.target.value})}
                                placeholder="Olá! Seja bem-vindo à InovaTech..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Regras de Comportamento</label>
                            <textarea 
                                rows={4}
                                className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm"
                                value={formData.regras_ia}
                                onChange={(e) => setFormData({...formData, regras_ia: e.target.value})}
                                placeholder="Ex: Nunca dê descontos maiores que 10%. Sempre peça o nome. Não use emojis em excesso."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Teste Col 3 */}
        <div className="space-y-8">
            <div className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 md:p-10 sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="text-purple-400" size={20} />
                    <h3 className="text-white font-black uppercase tracking-widest text-xs">Testar Resposta</h3>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <textarea 
                            rows={3}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 px-6 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm"
                            value={testPergunta}
                            onChange={(e) => setTestPergunta(e.target.value)}
                            placeholder="Faça uma pergunta para simular..."
                        />
                        <button 
                            onClick={handleTest}
                            disabled={testing || !testPergunta}
                            className="absolute right-3 bottom-3 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-900/30 transition-all disabled:opacity-30 active:scale-90"
                        >
                            {testing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {testResposta && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={14} className="text-purple-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resposta da IA</span>
                                </div>
                                <p className="text-white text-sm leading-relaxed">{testResposta}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4">
                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                        <div>
                            <p className="text-amber-500/90 text-[10px] font-black uppercase tracking-widest mb-1">Dica de Especialista</p>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Se o WhatsApp estiver conectado, a IA já começará a responder automaticamente usando estas configurações.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </ClienteLayout>
  );
}
