'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOOD_RESPONSES, MOOD_CONFIGS } from '../constants';
import type { MoodLevel } from '../types';

interface Props {
  mood: MoodLevel;
  onDismiss: () => void;
  onSaveNote?: (note: string) => void;
}

export function MoodConfirmation({ mood, onDismiss, onSaveNote }: Props) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const response = MOOD_RESPONSES[mood];
  const config = MOOD_CONFIGS[mood];

  useEffect(() => {
    const timer = setTimeout(onDismiss, showNote ? 10000 : 2500);
    return () => clearTimeout(timer);
  }, [onDismiss, showNote]);

  const handleSaveNote = () => {
    if (note.trim()) onSaveNote?.(note.trim());
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-4 text-center mt-4"
    >
      <span className="text-4xl">{config.emoji}</span>
      <p className="text-lg font-medium" style={{ color: config.color }}>
        {response.message}
      </p>

      {!showNote && (
        <button
          onClick={() => setShowNote(true)}
          className="text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          agregar nota
        </button>
      )}

      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 140))}
              placeholder="Que esta pasando?"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                shadow-sm placeholder:text-gray-300
                focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200
                transition-colors resize-none"
              rows={2}
              maxLength={140}
              autoFocus
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{note.length}/140</span>
              <button
                onClick={handleSaveNote}
                className="text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                guardar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
