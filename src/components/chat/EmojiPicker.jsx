import React, { useEffect, useRef } from 'react';
import EmojiPickerReact, { Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmojiPicker({ onEmojiSelect, isOpen, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-24 left-8 z-[100] shadow-2xl rounded-3xl overflow-hidden border border-white/10"
        >
          <EmojiPickerReact
            onEmojiClick={(emojiData) => {
              onEmojiSelect(emojiData.emoji);
            }}
            theme={Theme.DARK}
            lazyLoadEmojis={true}
            searchPlaceholder="Buscar emoji..."
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
