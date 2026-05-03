'use client';

import { motion } from 'framer-motion';
import { STAR_LABELS } from '../constants';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => onChange(star === value ? 0 : star)}
            className="text-3xl transition-colors"
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
          >
            {star <= value ? '⭐' : '☆'}
          </motion.button>
        ))}
      </div>
      {value > 0 && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-gray-700"
        >
          {STAR_LABELS[value]}
        </motion.span>
      )}
    </div>
  );
}
