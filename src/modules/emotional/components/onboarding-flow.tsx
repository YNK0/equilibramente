'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageEnter, pageTransition } from '@/lib/motion';

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    emoji: '👋',
    title: 'Como te sientes?',
    description: 'Cada dia te preguntaremos como estas. Es el primer paso para conocerte mejor.',
  },
  {
    emoji: '📅',
    title: 'Todos los dias',
    description: 'Hacer tu check-in toma menos de 10 segundos. Convierte esto en un habito diario.',
  },
  {
    emoji: '🧠',
    title: 'Esto nos ayuda a ayudarte',
    description: 'Conocer como te sientes nos permite recomendarte acciones para manejar mejor tu carga.',
  },
];

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          {...pageEnter}
          transition={pageTransition}
          className="flex flex-col items-center gap-6"
        >
          <span className="text-7xl">{STEPS[step].emoji}</span>
          <h2 className="text-2xl font-bold text-gray-900">{STEPS[step].title}</h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            {STEPS[step].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white
            shadow-sm hover:bg-purple-700 transition-colors"
        >
          {step < STEPS.length - 1 ? 'Siguiente' : 'Empezar'}
        </button>
      </div>
    </div>
  );
}
