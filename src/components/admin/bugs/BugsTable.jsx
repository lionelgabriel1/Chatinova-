import React from 'react';
import DataTable from '../shared/DataTable';
import BugStatusBadge from './BugStatusBadge';
import BugPriorityBadge from './BugPriorityBadge';
import ActionButton from '../shared/ActionButton';
import { Eye, CheckCircle, ExternalLink } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';

export default function BugsTable({ bugs, loading, onSelect, onResolve }) {
  const columns = [
    {
      label: 'Cliente',
      render: (row) => (
        <div>
          <p className="text-sm font-bold text-white">{row.clientes?.nome || '---'}</p>
          <p className="text-[10px] text-slate-500">{row.clientes?.email || '---'}</p>
        </div>
      )
    },
    { label: 'Título', key: 'titulo', className: 'text-sm font-medium text-slate-300' },
    { 
      label: 'Prioridade', 
      render: (row) => <BugPriorityBadge prioridade={row.prioridade} /> 
    },
    { 
      label: 'Status', 
      render: (row) => <BugStatusBadge status={row.status} /> 
    },
    { label: 'Página', key: 'pagina', className: 'text-xs text-slate-500 font-mono' },
    { 
      label: 'Data', 
      render: (row) => <span className="text-xs text-slate-500">{formatDateTime(row.created_at)}</span>
    },
    {
      label: 'Ações',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionButton 
            icon={Eye} 
            title="Ver Detalhes" 
            color="blue" 
            onClick={() => onSelect(row)} 
          />
          {row.status !== 'resolvido' && (
            <ActionButton 
              icon={CheckCircle} 
              title="Resolver" 
              color="green" 
              onClick={() => onResolve(row.id)} 
            />
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={bugs} 
      loading={loading} 
      emptyMessage="Nenhum bug reportado no momento."
    />
  );
}
