import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import Skeleton from './Skeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl backdrop-blur-xl shadow-2xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EmptyState = ({ message = "Sem dados suficientes" }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 opacity-50">
    <BarChart3 size={48} />
    <p className="text-sm font-medium tracking-wide">{message}</p>
  </div>
);

export function AccessChart({ data = [], loading = false }) {
  return (
    <div className="glass-card p-6 border border-slate-800 rounded-2xl h-[400px] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Fluxo de Acessos</h3>
          <p className="text-sm text-slate-500">Acompanhamento de visitantes reais</p>
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        {loading ? (
          <Skeleton className="w-full h-full rounded-xl" />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="acessos" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAcessos)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export function MessagesChart({ data = [], loading = false }) {
  return (
    <div className="glass-card p-6 border border-slate-800 rounded-2xl h-[400px] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Envio de Mensagens</h3>
          <p className="text-sm text-slate-500">Volume processado no período</p>
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        {loading ? (
          <Skeleton className="w-full h-full rounded-xl" />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: '#1e293b', radius: 8 }} content={<CustomTooltip />} />
              <Bar dataKey="mensagens" fill="#818cf8" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#6366f1" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="Sem dados para exibir gráfico" />
        )}
      </div>
    </div>
  );
}
