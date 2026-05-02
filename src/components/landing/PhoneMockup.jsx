import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Phone, Video, CheckCheck, ChevronLeft } from 'lucide-react';

const GROQ_API_KEY = "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";
const SYSTEM_PROMPT = "Você é uma vendedora especialista do INOVACHAT. Responda de forma curta (máximo 2 parágrafos), persuasiva e amigável, como se estivesse no WhatsApp. Use emojis moderadamente. Foque em benefícios: atendimento 24h, IA que vende sozinha e facilidade de configuração. Incentive o usuário a criar uma conta teste.";

const PhoneMockup = () => {
  const [messages, setMessages] = useState([
    { 
      id: Date.now(),
      text: "Olá! 👋 Sou a IA do INOVACHAT. Posso te mostrar como automatizar seu atendimento no WhatsApp e vender 24h por dia. Como posso ajudar seu negócio hoje?", 
      isIA: true, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const generateAIResponse = async (userText) => {
    setIsTyping(true);
    try {
      // Nota: Em produção, esta chamada deve ser feita via Backend para proteger a API KEY
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-4).map(m => ({ role: m.isIA ? "assistant" : "user", content: m.text })),
            { role: "user", content: userText }
          ],
          max_tokens: 300
        })
      });

      const data = await response.json();
      const aiText = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { 
        id: Date.now(),
        text: aiText, 
        isIA: true, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      console.error("Erro Groq:", error);
      setMessages(prev => [...prev, { 
        id: Date.now(),
        text: "Desculpe, tive um problema técnico. Pode tentar novamente?", 
        isIA: true, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = { 
      id: Date.now(),
      text: inputText, 
      isIA: false, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages(prev => [...prev, userMsg]);
    const textToSend = inputText;
    setInputText("");
    
    // Pequeno delay para a resposta começar
    setTimeout(() => {
      generateAIResponse(textToSend);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="relative mx-auto w-full max-w-[320px] md:max-w-[350px]">
      {/* Phone Frame */}
      <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-slate-800 overflow-hidden aspect-[9/19]">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Inner Screen */}
        <div className="relative h-full bg-[#f0f2f5] rounded-[2.2rem] overflow-hidden flex flex-col">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] pt-8 pb-3 px-4 flex items-center justify-between text-white shadow-md z-20">
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} />
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center font-bold overflow-hidden border border-white/20">
                <img src="/favicon.png" alt="InovaChat" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">INOVACHAT AI</h3>
                <p className="text-[9px] opacity-80">vendedora online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-90">
              <Video size={16} />
              <Phone size={14} />
              <MoreVertical size={16} />
            </div>
          </div>

          {/* Chat Content */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] scroll-smooth"
            style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.isIA ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`relative max-w-[85%] p-2.5 rounded-xl text-xs font-medium shadow-sm ${msg.isIA ? 'bg-white text-slate-800 rounded-tl-none' : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'}`}>
                    {msg.text}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[8px] opacity-50">{msg.time}</span>
                      {!msg.isIA && <CheckCheck size={10} className="text-blue-500" />}
                    </div>
                    {/* Triangle Tail */}
                    <div className={`absolute top-0 w-2 h-2 ${msg.isIA ? '-left-1 bg-white rotate-45' : '-right-1 bg-[#dcf8c6] rotate-45'}`} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="bg-[#f0f2f5] p-2 px-3 flex items-center gap-2 border-t border-slate-200">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-white h-10 rounded-full px-4 text-slate-700 text-xs focus:outline-none border border-transparent focus:border-emerald-500/30 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all ${!inputText.trim() || isTyping ? 'bg-slate-400 opacity-50' : 'bg-[#075e54] active:scale-95'}`}
            >
              <Send size={18} className={inputText.trim() && !isTyping ? "translate-x-0.5" : ""} />
            </button>
          </form>
        </div>

        {/* Inner Border Reflection */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[3rem] z-40" />
      </div>

      {/* Decorative Shadows & Glows */}
      <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] -z-10 animate-pulse" />
    </div>
  );
};

export default PhoneMockup;
