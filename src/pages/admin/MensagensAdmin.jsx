import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Smile, 
  Paperclip, 
  CheckCheck,
  User,
  MessageSquare,
  Circle,
  FileText,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { chatService } from '../../services/chatService';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../hooks/useToast';
import EmojiPicker from '../../components/chat/EmojiPicker';
import FileUploadPreview from '../../components/chat/FileUploadPreview';

const ContactItem = ({ contact, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 cursor-pointer border-b border-white/5 transition-all ${
      isActive ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : 'hover:bg-white/5'
    }`}
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black text-xl shadow-lg">
        {contact.nome_cliente?.[0] || 'U'}
      </div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${contact.status === 'ativo' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-black text-white truncate text-sm">{contact.nome_cliente}</h4>
        <span className="text-[10px] text-slate-500 font-bold uppercase whitespace-nowrap ml-2">
          {new Date(contact.ultima_mensagem_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="text-xs text-slate-400 truncate font-medium">
        {contact.ultima_mensagem}
      </p>
    </div>
  </div>
);

const MessageBubble = ({ msg, isAdmin }) => {
  const isImage = msg.tipo === 'imagem';
  const isFile = msg.tipo === 'arquivo';

  return (
    <div className={`flex w-full mb-4 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`max-w-[70%] p-4 rounded-[1.5rem] relative shadow-xl ${
          isAdmin 
            ? 'bg-indigo-600 text-white rounded-tr-none' 
            : 'bg-slate-800 text-slate-100 rounded-tl-none'
        }`}
      >
        {isImage && (
          <div className="mb-2 rounded-xl overflow-hidden cursor-pointer group relative">
            <img 
              src={msg.arquivo_url} 
              alt="Anexo" 
              className="max-w-full max-h-64 object-cover hover:scale-105 transition-transform duration-500" 
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
            className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl mb-2 transition-all border border-white/5"
          >
            <div className="p-2 bg-indigo-500 rounded-lg">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{msg.arquivo_nome}</p>
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Download Arquivo</p>
            </div>
            <Download size={16} className="opacity-60" />
          </a>
        )}

        {msg.conteudo && <p className="text-sm font-medium leading-relaxed">{msg.conteudo}</p>}
        
        <div className={`flex items-center justify-end gap-1 mt-2 opacity-60`}>
          <span className="text-[9px] font-black uppercase">
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAdmin && <CheckCheck size={12} className={msg.lida ? 'text-emerald-400' : 'text-slate-300'} />}
        </div>
      </motion.div>
    </div>
  );
};

export default function MensagensAdmin() {
  const toast = useToast();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
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

  const loadContacts = async () => {
    try {
      const data = await chatService.getAdminChatContacts();
      setContacts(data);
      setLoading(false);
    } catch (error) {
      toast.error('Falha ao carregar contatos.');
    }
  };

  const openChat = async (contact) => {
    setActiveContact(contact);
    setMensagens([]);
    try {
      const msgs = await chatService.getMensagens(contact.id);
      setMensagens(msgs);
      await chatService.marcarComoLida(contact.id);
    } catch (error) {
      toast.error('Erro ao carregar histórico.');
    }
  };

  const handleEmojiSelect = (emoji) => {
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const text = inputText;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setInputText(newText);
    setIsEmojiOpen(false);
    
    // Devolve o foco e ajusta o cursor (em um timeout para garantir o render)
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
    if ((!inputText.trim() && !selectedFile) || !activeContact || isUploading) return;

    setIsUploading(true);
    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadService.uploadChatFile(selectedFile, activeContact.id);
      }

      const adminId = '00000000-0000-0000-0000-000000000000'; 
      await chatService.enviarMensagemAdmin(activeContact.id, inputText, adminId, fileData);
      
      setInputText('');
      setSelectedFile(null);
      loadContacts();
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
    loadContacts();

    const subscription = chatService.subscribeConversas(() => {
      loadContacts();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auto-selecionar cliente se vier de uma notificação
  useEffect(() => {
    if (location.state?.selectedClienteId && contacts.length > 0) {
      const contact = contacts.find(c => c.id === location.state.selectedClienteId);
      if (contact) {
        openChat(contact);
      }
    }
  }, [location.state, contacts]);

  useEffect(() => {
    if (!activeContact) return;

    const subscription = chatService.subscribeMensagens(activeContact.id, (newMsg) => {
      setMensagens(prev => {
        // Evita duplicatas se a mensagem enviada pelo próprio admin for recebida via realtime
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-160px)] flex bg-slate-900/60 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl relative">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-white/5 flex flex-col bg-slate-900/40">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-6">Contatos</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente..."
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-2 ring-indigo-500/20 transition-all font-medium outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-black uppercase text-xs tracking-[0.2em] animate-pulse">Sincronizando...</div>
            ) : (
              contacts.map(contact => (
                <ContactItem 
                  key={contact.id} 
                  contact={contact} 
                  isActive={activeContact?.id === contact.id}
                  onClick={() => openChat(contact)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-950/20 relative">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                    {activeContact.nome_cliente?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base leading-none mb-1">{activeContact.nome_cliente}</h4>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <Circle size={8} fill="currentColor" className="animate-pulse" /> Suporte Ativo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Search size={20} />
                  </button>
                  <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 scroll-smooth flex flex-col custom-scrollbar">
                {mensagens.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} isAdmin={msg.remetente_tipo === 'admin'} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-slate-900/60 border-t border-white/5 backdrop-blur-xl">
                <FileUploadPreview 
                  file={selectedFile} 
                  onRemove={() => setSelectedFile(null)} 
                  isUploading={isUploading}
                />

                <div className="p-8">
                  <form onSubmit={handleSend} className="flex items-end gap-4 max-w-5xl mx-auto relative">
                    <div className="flex gap-1 mb-2">
                      <button 
                        type="button" 
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                        className={`p-3 transition-colors ${isEmojiOpen ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'}`}
                      >
                        <Smile size={24} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-500 hover:text-indigo-400 transition-colors"
                      >
                        <Paperclip size={24} />
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
                      placeholder="Escreva sua resposta..."
                      rows={1}
                      className="flex-1 bg-slate-800/80 border border-white/5 rounded-[1.2rem] py-5 px-8 text-sm text-white focus:ring-2 ring-indigo-500/20 transition-all font-medium outline-none resize-none max-h-32"
                    />
                    
                    <button 
                      disabled={(!inputText.trim() && !selectedFile) || isUploading}
                      type="submit"
                      className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40 transition-all active:scale-95 shrink-0"
                    >
                      <Send size={28} />
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-32 h-32 rounded-[3rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/5">
                <MessageSquare size={56} />
              </div>
              <h3 className="text-4xl font-black text-white tracking-tighter mb-4">Atendimento Interno</h3>
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                Selecione um cliente da lista à esquerda para visualizar o histórico e responder em tempo real.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
