import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image as ImageIcon, File } from 'lucide-react';

export default function FileUploadPreview({ file, onRemove, isUploading }) {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: 10, height: 0 }}
        className="px-8 py-4 bg-slate-800/80 backdrop-blur-xl border-t border-white/5 overflow-hidden"
      >
        <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 relative group max-w-md">
          {/* Preview da Imagem ou Ícone */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
            {isImage ? (
              <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText size={24} className="text-indigo-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate pr-6">{file.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {isImage ? 'Imagem' : 'Documento'}
            </p>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Enviando...</span>
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
