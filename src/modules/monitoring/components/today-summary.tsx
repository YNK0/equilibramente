import type { MoodLevel } from '@/modules/emotional/types';

const moodEmojis: Record<string, string> = {
  great: '😊',
  okay: '😐',
  stressed: '😫',
  overwhelmed: '😵',
};

interface MoodCardProps {
  mood: MoodLevel | null;
}

interface TasksCardProps {
  completed: number;
  total: number;
}

function MoodCard({ mood }: MoodCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
      <span className="text-2xl">{mood ? moodEmojis[mood] : '❓'}</span>
      <span className="text-xs font-medium text-gray-500">{mood ?? 'Sin registro'}</span>
      <span className="text-[10px] text-gray-400">Hoy</span>
    </div>
  );
}

function TasksCard({ completed, total }: TasksCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
      <span className="text-2xl">✅</span>
      <span className="text-xs font-medium text-gray-700">
        {completed} de {total}
      </span>
      <span className="text-[10px] text-gray-400">completadas</span>
    </div>
  );
}

export const TodaySummary = { Mood: MoodCard, Tasks: TasksCard };
