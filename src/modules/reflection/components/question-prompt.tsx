'use client';

import { motion } from 'framer-motion';

interface QuestionPromptProps {
  question: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  step: number;
  total: number;
  maxLength?: number;
}

export function QuestionPrompt({
  question,
  placeholder,
  value,
  onChange,
  onNext,
  onSkip,
  step,
  total,
  maxLength = 280,
}: QuestionPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-4 p-4"
    >
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Pregunta {step} de {total}
        </span>
        <button onClick={onSkip} className="text-purple-600 font-medium">
          Saltar
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-900">{question}</h2>

      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) onChange(e.target.value);
        }}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-colors resize-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {value.length}/{maxLength}
        </span>
        <button
          onClick={onNext}
          className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}
