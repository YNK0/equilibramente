export const DAILY_QUESTIONS = [
  {
    key: 'q1' as const,
    question: '¿Qué te estresó hoy?',
    placeholder: 'Un examen, una discusión, acumulación de tareas...',
  },
  {
    key: 'q2' as const,
    question: '¿Qué te ayudó a sentirte mejor?',
    placeholder: 'Respirar, hablar con alguien, organizar mis tareas...',
  },
  {
    key: 'q3' as const,
    question: '¿Qué harías diferente mañana?',
    placeholder: 'Empezar más temprano, tomar pausas, pedir ayuda...',
  },
];

export const STAR_LABELS: Record<number, string> = {
  1: 'Muy mal',
  2: 'Mal',
  3: 'Normal',
  4: 'Bien',
  5: 'Excelente',
};

export const MAX_CHARACTERS = 280;
