import React, { useState, useEffect } from 'react';
import ClienteLayout from '../../layouts/ClienteLayout';
import BugReportForm from '../../components/client/bugs/BugReportForm';
import MyBugReports from '../../components/client/bugs/MyBugReports';
import { bugReportService } from '../../services/bugReportService';
import { clientAuthService } from '../../services/clientAuthService';
import { motion } from 'framer-motion';

export default function ReportarBug() {
  const [myBugs, setMyBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const cliente = clientAuthService.getClienteLogado();

  const fetchBugs = async () => {
    if (!cliente) return;
    try {
      const data = await bugReportService.getMyBugReports(cliente.id);
      setMyBugs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
    
    // Assinar mudanças
    const sub = bugReportService.subscribeBugs(() => fetchBugs());
    
    return () => sub.unsubscribe();
  }, [cliente?.id]);

  return (
    <ClienteLayout>
      <div className="space-y-12">
        <header>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tracking-tighter"
          >
            Reportar <span className="text-purple-500">Bug</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mt-2 font-medium"
          >
            Encontrou algum erro? Envie os detalhes para nossa equipe corrigir.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <BugReportForm clienteId={cliente?.id} onSuccess={fetchBugs} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Meus Reports</h3>
              <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">{myBugs.length}</span>
            </div>
            
            <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <MyBugReports bugs={myBugs} onSelect={(bug) => console.log('Selecionado:', bug)} />
            </div>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
