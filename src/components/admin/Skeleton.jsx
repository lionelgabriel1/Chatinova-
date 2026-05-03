import React from 'react';

export default function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}></div>
  );
}
