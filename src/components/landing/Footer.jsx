import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/favicon.png" alt="InovaChat" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Inova<span className="text-emerald-600">Chat</span></span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-xs">
              A próxima geração do atendimento via WhatsApp. Inteligência artificial avançada para automatizar sua comunicação de forma humana e eficiente.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, MessageCircle, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-8">Navegação</h4>
            <ul className="space-y-4">
              {['Início', 'Recursos', 'Como funciona', 'Segurança', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-8">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link to="/cadastro" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">Criar Conta</Link></li>
              <li><Link to="/login" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">Painel do Cliente</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-8">Jurídico</h4>
            <ul className="space-y-4">
              <li><a href="#termos" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">Termos de Uso</a></li>
              <li><a href="#politicas" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">Política de Privacidade</a></li>
              <li className="pt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Mail size={16} />
                suporte@inovachat.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-slate-500 text-xs font-medium">
            © 2026 INOVACHAT. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 text-xs font-medium hover:text-emerald-600 transition-colors">Status do Servidor</a>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500 text-xs font-medium">Sistemas Operacionais</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
