'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onFeedback: (wasHelpful: boolean) => void;
  onClose: () => void;
}

export function ActionFeedback({ onFeedback, onClose }: Props) {
  const [voted, setVoted] = useState(false);

  return (
    <AnimatePresence>
      {!voted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center"
        >
          <p className="text-sm font-medium text-gray-700">Te sirvio esto?</p>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => {
                setVoted(true);
                onFeedback(true);
              }}
              className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Si, gracias
            </button>
            <button
              onClick={() => {
                setVoted(true);
                onFeedback(false);
              }}
              className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg transition-colors"
            >
              No mucho
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Cerrar sin votar
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
