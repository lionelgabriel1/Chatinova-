import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Recursos', href: '#recursos' },
    { name: 'Como funciona', href: '#como-funciona' },
    { name: 'Segurança', href: '#seguranca' },
    { name: 'Termos', href: '#termos' },
    { name: 'Políticas', href: '#politicas' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform overflow-hidden">
            <img src="/favicon.png" alt="InovaChat" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Inova<span className="text-emerald-500">Chat</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="px-6 py-2.5 text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors">
            Entrar
          </Link>
          <Link to="/cadastro" className="px-8 py-3 bg-emerald-600 text-white font-black text-sm rounded-full shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all">
            Criar conta
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 lg:hidden flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-slate-900"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link to="/login" className="w-full py-4 text-center font-black text-slate-900 border border-slate-200 rounded-2xl">
                Entrar
              </Link>
              <Link to="/cadastro" className="w-full py-4 text-center font-black bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-900/20">
                Criar conta
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
