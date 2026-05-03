'use client';

import { AchievementsGrid } from '@/modules/achievements/components/achievements-grid';
import { StreakDisplay } from '@/modules/achievements/components/streak-display';
import { AppShell } from '@/modules/shared/components/layout/app-shell';

export default function LogrosPage() {
  return (
    <AppShell title="Logros">
      <div className="pb-4">
        <div className="p-4 pb-0">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Rachas activas
          </h2>
        </div>
        <div className="px-4">
          <StreakDisplay />
        </div>
        <div className="mt-4">
          <AchievementsGrid />
        </div>
      </div>
    </AppShell>
  );
}
