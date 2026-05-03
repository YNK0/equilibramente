'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { DAILY_QUESTIONS } from '../constants';
import { useReflection } from '../hooks/use-reflection';
import { QuestionPrompt } from './question-prompt';
import { StarRating } from './star-rating';

export function ReflectionForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({ q1: '', q2: '', q3: '' });
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { saving, save } = useReflection();
  const questionsCount = DAILY_QUESTIONS.length;

  const handleAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < questionsCount) setStep(step + 1);
  }, [step]);

  const handleSave = useCallback(async () => {
    const hasAnyAnswer = Object.values(answers).some((a) => a.trim().length > 0) || rating > 0;
    if (!hasAnyAnswer) return;
    await save({
      question_1: answers.q1 || null,
      question_2: answers.q2 || null,
      question_3: answers.q3 || null,
      day_rating: rating || null,
    });
    setSubmitted(true);
  }, [answers, rating, save]);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="text-5xl">🌱</span>
        <h3 className="text-xl font-semibold text-gray-900">Gracias por reflexionar</h3>
        <p className="text-sm text-gray-500">
          Mañana será mejor. Cada reflexión te ayuda a conocerte.
        </p>
      </div>
    );
  }

  if (step < questionsCount) {
    const q = DAILY_QUESTIONS[step];
    return (
      <AnimatePresence mode="wait">
        <QuestionPrompt
          key={q.key}
          question={q.question}
          placeholder={q.placeholder}
          value={answers[q.key] || ''}
          onChange={(v) => handleAnswer(q.key, v)}
          onNext={handleNext}
          onSkip={handleNext}
          step={step + 1}
          total={questionsCount}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900">En general, ¿cómo estuvo tu día?</h3>
      <StarRating value={rating} onChange={setRating} />
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Guardando...' : 'Completar reflexión'}
      </button>
      <p className="text-xs text-gray-400">O salta sin responder — cero presión</p>
    </div>
  );
}
