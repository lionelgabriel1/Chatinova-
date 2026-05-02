import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

export default function DataTable({ columns, data, loading, emptyMessage, mobileRender }) {
  if (loading) return <LoadingSkeleton rows={5} />;
  
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        <AnimatePresence>
          {data.map((row, rowIdx) => (
            <motion.div
              key={row.id || rowIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 border border-white/5 rounded-3xl"
            >
              {mobileRender ? mobileRender(row) : (
                <div className="space-y-3">
                  {columns.map((col, colIdx) => (
                    <div key={colIdx} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[80px]">
                        {col.label}
                      </span>
                      <div className="text-sm text-right">
                        {col.render ? col.render(row) : row[col.key]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block glass-card border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${col.className || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              <AnimatePresence>
                {data.map((row, rowIdx) => (
                  <motion.tr 
                    key={row.id || rowIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-6 py-4 ${col.className || ''}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
