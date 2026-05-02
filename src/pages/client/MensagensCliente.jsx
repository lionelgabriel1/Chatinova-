import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Paperclip, 
  CheckCheck,
  MessageSquare,
  Circle,
  ShieldCheck,
  FileText,
  Download,
  Image as ImageIcon
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
        {isImage && (
          <div className="mb-3 rounded-2xl overflow-hidden cursor-pointer group relative">
            <img 
              src={msg.arquivo_url} 
              alt="Anexo" 
              className="max-w-full max-h-80 object-cover hover:scale-105 transition-transform duration-700" 
              onClick={() => window.open(msg.arquivo_url, '_blank')}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Download size={24} className="text-white" />
            </div>
          </div>
        )}

        {isFile && (
          <a 
            href={msg.arquivo_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl mb-3 transition-all border border-white/5"
          >
            <div className="p-2.5 bg-purple-500 rounded-xl">
              <FileText size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{msg.arquivo_nome}</p>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Clique para baixar</p>
            </div>
            <Download size={18} className="opacity-60" />
          </a>
        )}

        {msg.conteudo && <p className="text-sm md:text-base font-medium leading-relaxed">{msg.conteudo}</p>}
        
        <div className={`flex items-center justify-end gap-1.5 mt-3 opacity-50`}>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMine && <CheckCheck size={14} className={msg.lida ? 'text-emerald-400' : 'text-slate-300'} />}
        </div>
      </motion.div>
    </div>
  );
};

export default function MensagensCliente() {
  const toast = useToast();
  const cliente = clientAuthService.getClienteLogado();
  const [mensagens, setMensagens] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      if (!cliente?.id) return;
      setLoading(true);
      const msgs = await chatService.getMensagens(cliente.id);
      setMensagens(msgs);
      await chatService.marcarComoLida(cliente.id);
    } catch (error) {
      toast.error('Falha ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const text = inputText;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setInputText(newText);
    setIsEmojiOpen(false);
    
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 10);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Limite de 10MB excedido.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isUploading) return;

    setIsUploading(true);
    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadService.uploadChatFile(selectedFile, cliente.id);
      }

      await chatService.enviarMensagemCliente(cliente.id, inputText, fileData);
      
      setInputText('');
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  useEffect(() => {
    loadData();

    const subscription = chatService.subscribeMensagens(cliente.id, (newMsg) => {
      setMensagens(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  return (
    <ClienteLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Central de Atendimento</h1>
          <p className="text-slate-500 font-medium">Tire suas dúvidas diretamente com nosso suporte técnico.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Circle size={8} fill="currentColor" className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">Suporte Online</span>
        </div>
      </div>

      <div className="h-[70vh] min-h-[500px] flex flex-col bg-slate-900/40 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl relative">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg tracking-tight">Equipe InovaChat</h4>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Atendimento VIP em tempo real</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth bg-slate-950/30 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando chat...</span>
              </div>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-slate-500" />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Envie uma mensagem para iniciar o atendimento</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mensagens.map(msg => (
                <MessageBubble key={msg.id} msg={msg} isMine={msg.remetente_tipo === 'cliente'} />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-900/80 border-t border-white/5 backdrop-blur-2xl">
          <FileUploadPreview 
            file={selectedFile} 
            onRemove={() => setSelectedFile(null)} 
            isUploading={isUploading}
          />

          <div className="p-6 md:p-8">
            <form onSubmit={handleSend} className="flex items-end gap-4 max-w-6xl mx-auto relative">
              <div className="flex gap-1 mb-2">
                <button 
                  type="button" 
                  onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                  className={`p-3 transition-colors ${isEmojiOpen ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'}`}
                >
                  <Smile size={28} />
                </button>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-500 hover:text-purple-400 transition-colors"
                >
                  <Paperclip size={28} />
                </button>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />

              <EmojiPicker 
                isOpen={isEmojiOpen} 
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setIsEmojiOpen(false)}
              />

              <textarea 
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva sua mensagem aqui..."
                rows={1}
                className="flex-1 bg-slate-800/80 border border-white/5 rounded-[1.8rem] py-5 md:py-6 px-8 md:px-10 text-sm md:text-base text-white placeholder-slate-500 focus:ring-4 ring-purple-500/10 transition-all font-medium outline-none shadow-inner resize-none max-h-32"
              />
              
              <button 
                disabled={(!inputText.trim() && !selectedFile) || isUploading}
                type="submit"
                className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-purple-900/60 transition-all active:scale-90 shrink-0"
              >
                <Send size={28} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
