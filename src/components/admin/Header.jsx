import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User, ChevronDown, Menu, Shield } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function Header({ onMenuOpen, notificationCount = 0 }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdmin(user);
    };
    fetchAdmin();
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 glass border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={onMenuOpen}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>

        {/* Logo Mobile (Visible only on small screens) */}
        <div className="flex lg:hidden items-center gap-2">
           <Shield className="text-blue-500" size={24} />
           <span className="font-bold text-white text-lg">INOVACHAT</span>
        </div>

        {/* Search (Hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <Search className="text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="bg-transparent border-none outline-none text-slate-300 w-32 md:w-64 placeholder:text-slate-600 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <Bell className="text-slate-400" size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[10px] font-black rounded-full border-2 border-slate-900 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        <div className="hidden md:block h-8 w-[1px] bg-slate-800"></div>

        <div className="flex items-center gap-2 md:gap-3 pl-2 group cursor-pointer">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">
              {admin?.email?.split('@')[0] || 'Admin'}
            </span>
            <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
              Suporte Cloud
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105">
            <User className="text-white" size={20} />
          </div>
          <ChevronDown className="hidden sm:block text-slate-500 group-hover:text-white transition-colors" size={16} />
        </div>
      </div>
    </motion.header>
  );
}
