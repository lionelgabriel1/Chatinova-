import React from 'react';
import Skeleton from '../Skeleton';

export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="glass-card border border-slate-800 rounded-2xl p-6">
      <div className="space-y-4">
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800/50">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-48 h-4 rounded-lg" />
              <Skeleton className="w-32 h-3 rounded-lg" />
            </div>
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
