import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/shared/PageHeader';
import { 
  Shield, 
  UserPlus, 
  Search,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Power,
  Trash2,
  Mail,
  User,
  Clock
} from 'lucide-react';
import { adminsService } from '../../services/adminsService';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminFormModal from '../../components/admin/admins/AdminFormModal';

export default function Administradores() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [isSuper, setIsSuper] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, superCheck] = await Promise.all([
        adminsService.getAdmins(),
        adminsService.isSuperAdmin()
      ]);
      setAdmins(data);
      setIsSuper(superCheck);
    } catch (error) {
      toast.error('Erro ao carregar administradores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, email) => {
    if (email === 'suporte@inovapro.cloud') {
      return toast.error('O super admin principal não pode ser removido.');
    }
    
    if (!confirm('Tem certeza que deseja remover este administrador? O acesso será revogado imediatamente.')) return;

    try {
      await adminsService.deleteAdmin(id);
      toast.success('Administrador removido com sucesso.');
      loadData();
    } catch (error) {
      toast.error('Erro ao remover: ' + error.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus, email) => {
    if (email === 'suporte@inovapro.cloud') {
      return toast.error('Não é possível bloquear o super admin principal.');
    }

    try {
      await adminsService.toggleAdminStatus(id, currentStatus);
      toast.success('Status atualizado.');
      loadData();
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader 
        title="Administradores" 
        subtitle="Gerencie a equipe administrativa e permissões do sistema"
      >
        {isSuper && (
          <button 
            onClick={() => { setSelectedAdmin(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <UserPlus size={18} />
            <span>Novo Admin</span>
          </button>
        )}
      </PageHeader>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Buscar administradores..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-8 border border-white/5 rounded-[2.5rem] animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-24 bg-slate-800/50 rounded-2xl"></div>
            </div>
          ))
        ) : filteredAdmins.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500">Nenhum administrador encontrado.</p>
          </div>
        ) : (
          filteredAdmins.map((admin) => (
            <motion.div 
              layout
              key={admin.id}
              className={`glass-card p-6 sm:p-8 border border-white/5 rounded-[2.5rem] relative overflow-hidden group ${admin.status === 'bloqueado' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
                    admin.is_super_admin 
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-600/20' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-600/20'
                  }`}>
                    {admin.nome?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg tracking-tight">{admin.nome}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        admin.is_super_admin 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {admin.role}
                      </span>
                      {admin.status === 'bloqueado' && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-widest">
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {isSuper && admin.email !== 'suporte@inovapro.cloud' && (
                  <div className="flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleToggleStatus(admin.id, admin.status, admin.email)}
                      className={`p-2 rounded-xl transition-all ${admin.status === 'ativo' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                      title={admin.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                    >
                      <Power size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin.id, admin.email)}
                      className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Mail size={16} className="text-slate-600" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Clock size={16} className="text-slate-600" />
                  <span className="text-[11px] sm:text-sm">Log: {admin.ultimo_login ? new Date(admin.ultimo_login).toLocaleString('pt-BR') : 'Nunca logou'}</span>
                </div>
              </div>

              {admin.is_super_admin && (
                <div className="absolute top-4 right-4">
                  <ShieldAlert size={20} className="text-purple-500 opacity-20" />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <AdminFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        admin={selectedAdmin}
      />
    </AdminLayout>
  );
}
