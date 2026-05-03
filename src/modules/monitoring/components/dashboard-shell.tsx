'use client';

import { useDashboard } from '../hooks/use-dashboard';
import { LoadCard } from './load-card';
import { TodaySummary } from './today-summary';
import { StreakRow } from './streak-row';
import { MoodSparkline } from './mood-sparkline';
import { PendingTasksPreview } from './pending-tasks-preview';
import { MoodPicker } from '@/modules/emotional/components/mood-picker';
import { PageLoading } from '@/modules/shared/components/ui/loading';

interface Props {
  onCheckinComplete?: () => void;
}

export function DashboardShell({ onCheckinComplete }: Props) {
  const { today, week, pendingTasks, loading, needsCheckin, refresh } = useDashboard();

  if (needsCheckin) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">¿Cómo te sientes hoy?</h2>
          <MoodPicker onComplete={() => { refresh(); onCheckinComplete?.(); }} />
        </div>
      </div>
    );
  }

  if (loading || !today || !week) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <LoadCard level={today.load.level} score={today.load.score} />

      <div className="grid grid-cols-2 gap-3">
        <TodaySummary.Mood mood={today.checkin?.mood ?? null} />
        <TodaySummary.Tasks completed={today.tasks.completed} total={today.tasks.total} />
      </div>

      <StreakRow
        current={today.streak.current}
        longest={today.streak.longest}
        weekDays={week.days.map((d) => d.has_checkin)}
      />

      <MoodSparkline days={week.days} trend={week.summary.trend} />

      <PendingTasksPreview tasks={pendingTasks} total={today.tasks.pending} />
    </div>
  );
}
