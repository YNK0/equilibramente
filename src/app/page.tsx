'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { MoodPicker } from '@/modules/emotional/components/mood-picker';
import { MoodStateBanner } from '@/modules/emotional/components/mood-state-banner';
import { emotionalService } from '@/modules/emotional/services/emotional-service';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import type { EmotionalCheckin } from '@/modules/emotional/types';

export default function DashboardPage() {
  const [todayCheckin, setTodayCheckin] = useState<EmotionalCheckin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try { setTodayCheckin(await emotionalService.getToday()); } catch {}
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <AppShell title="Inicio"><PageLoading /></AppShell>;

  if (!todayCheckin) {
    return (
      <AppShell title="Inicio">
        <MoodPicker onComplete={() => window.location.reload()} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Inicio">
      <div className="p-4 space-y-4">
        <MoodStateBanner checkin={todayCheckin} onChange={() => setTodayCheckin(null)} />

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/tareas"
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
              active:scale-[0.98] transition-transform"
          >
            <span className="text-3xl">📝</span>
            <p className="mt-2 text-sm font-medium text-gray-900">Tareas</p>
            <p className="text-xs text-gray-400">Organiza tu dia</p>
          </Link>
          <Link
            href="/regular"
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
              active:scale-[0.98] transition-transform"
          >
            <span className="text-3xl">🧘</span>
            <p className="mt-2 text-sm font-medium text-gray-900">Bienestar</p>
            <p className="text-xs text-gray-400">Respira y relajate</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
