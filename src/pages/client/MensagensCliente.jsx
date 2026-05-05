import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Smile, Paperclip, CheckCheck, MessageSquare, Circle,
  ShieldCheck, FileText, Download, Image as ImageIcon
} from 'lucide-react';
import ClienteLayout from '../../layouts/ClienteLayout';
import { chatService } from '../../services/chatService';
import { clientAuthService } from '../../services/clientAuthService';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../hooks/useToast';
import EmojiPicker from '../../components/chat/EmojiPicker';
import FileUploadPreview from '../../components/chat/FileUploadPreview';

const MessageBubble = ({ msg, isMine }) => {
  const isImage = msg.tipo === 'imagem';
  const isFile = msg.tipo === 'arquivo';

  return (
    <div className={`flex w-full mb-6 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: isMine ? 20 : -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2rem] relative shadow-2xl ${
          isMine
            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tr-none'
            : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/5 backdrop-blur-md'
        }`}
      >
        {isImage && msg.arquivo_url ? (
          <div className="mb-2">
            <img src={msg.arquivo_url} alt="Imagem" className="rounded-xl w-full" />
          </div>
        ) : isFile && msg.arquivo_url ? (
          <a
            href={msg.arquivo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-2 hover:bg-white/20 transition-colors"
          >
            <FileText size={24} />
            <span className="flex-1 truncate text-sm">{msg.arquivo_nome || 'Arquivo'}</span>
            <Download size={20} />
          </a>
        ) : (
          <p className="text-sm md:text-base leading-relaxed">{msg.conteudo || msg.mensagem}</p>
        )}
        <div className={`flex items-center gap-1 mt-3 text-xs ${isMine ? 'text-white/70' : 'text-slate-500'}`}>
          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isMine && (msg.lida ? <CheckCheck size={14} className="text-blue-400" /> : <CheckCheck size={14} />)}
        </div>
      </motion.div>
    </div>
  );
};

export default function MensagensCliente() {
  const toast = useToast();
  const [cliente, setCliente] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Buscar o cliente de forma assíncrona
  useEffect(() => {
    async function loadCliente() {
      const data = await clientAuthService.getClienteLogado();
      setCliente(data);
    }
    loadCliente();
  }, []);

  const carregarMensagens = async () => {
    if (!cliente?.id) return;
    try {
      setLoading(true);
      const msgs = await chatService.getMensagens(cliente.id);
      setMensagens(msgs || []);
      await chatService.marcarComoLida(cliente.id);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cliente) {
      carregarMensagens();
    }
  }, [cliente]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;
    if (!cliente?.id) {
      toast.error('Erro: dados do cliente não carregados.');
      return;
    }

    let fileData = null;
    if (selectedFile) {
      setIsUploading(true);
      try {
        fileData = await uploadService.uploadChatFile(selectedFile, cliente.id);
      } catch (error) {
        toast.error('Falha ao enviar arquivo.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    try {
      await chatService.enviarMensagemCliente(cliente.id, inputText, fileData);
      setInputText('');
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar.');
    }
  };

  useEffect(() => {
    if (!cliente?.id) return;
    const subscription = chatService.subscribeMensagens(cliente.id, (newMsg) => {
      setMensagens((prev) => [...prev, newMsg]);
    });
    return () => { subscription?.unsubscribe(); };
  }, [cliente]);

  return (
    <ClienteLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
          <MessageSquare className="text-purple-400" size={28} />
          Suporte
        </h1>
        <p className="text-slate-500 font-medium">Converse em tempo real com nosso time.</p>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShieldCheck size={64} className="text-slate-700 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Bem-vindo ao Suporte</h3>
              <p className="text-slate-500 max-w-md">Envie sua primeira mensagem para começar a conversar com nossa equipe.</p>
            </div>
          ) : (
            mensagens.map((msg) => <MessageBubble key={msg.id} msg={msg} isMine={msg.remetente_tipo === 'cliente'} />)
          )}
        </div>

        {/* Área de input */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5">
          <AnimatePresence>
            {selectedFile && <FileUploadPreview file={selectedFile} onRemove={() => setSelectedFile(null)} />}
          </AnimatePresence>
          <form onSubmit={handleSend} className="flex items-end gap-4 max-w-6xl mx-auto relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"
              >
                <Smile size={20} />
              </button>
              <AnimatePresence>
                {isEmojiOpen && (
                  <EmojiPicker
                    onSelect={(emoji) => { setInputText((prev) => prev + emoji.native); setIsEmojiOpen(false); }}
                    onClose={() => setIsEmojiOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            <label className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Paperclip size={20} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </label>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || (!inputText.trim() && !selectedFile)}
              className="p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-900/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isUploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </ClienteLayout>
  );
}
