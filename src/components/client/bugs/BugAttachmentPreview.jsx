import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

export default function BugAttachmentPreview({ file, onRemove }) {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border border-white/10 bg-slate-800 flex items-center justify-center">
      {isImage ? (
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <FileText size={32} />
          <span className="text-[10px] font-bold uppercase truncate px-2 w-full text-center">
            {file.name}
          </span>
        </div>
      )}
      
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
      >
        <X size={14} />
      </button>
    </div>
  );
}
