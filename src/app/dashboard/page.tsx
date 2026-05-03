'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LoadIndicator } from '@/modules/analysis/components/load-indicator';
import { StressAlert } from '@/modules/analysis/components/stress-alert';
import { useLoadAnalysis } from '@/modules/analysis/hooks/use-load-analysis';
import type { LoadLevel } from '@/modules/analysis/types';
import { onDataChanged } from '@/modules/analysis/services/analysis-trigger';
import { MoodPicker } from '@/modules/emotional/components/mood-picker';
import { MoodStateBanner } from '@/modules/emotional/components/mood-state-banner';
import { emotionalService } from '@/modules/emotional/services/emotional-service';
import type { EmotionalCheckin } from '@/modules/emotional/types';
import { monitoringService } from '@/modules/monitoring/services/monitoring-service';
import type { TodayData } from '@/modules/monitoring/types';
import { RecommendationBanner } from '@/modules/recommendations/components/recommendation-banner';
import { useRecommendations } from '@/modules/recommendations/hooks/use-recommendations';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { PageLoading } from '@/modules/shared/components/ui/loading';

export default function DashboardPage() {
  const router = useRouter();
  const [todayCheckin, setTodayCheckin] = useState<EmotionalCheckin | null>(null);
  const [todayData, setTodayData] = useState<TodayData | null>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(true);
  const { analysis, loading: loadingAnalysis } = useLoadAnalysis();
  const { recommendations, loadLevel, dismiss, sendFeedback } = useRecommendations();

  const loadToday = useCallback(async () => {
    const [checkin, data] = await Promise.all([
      emotionalService.getToday(),
      monitoringService.getToday().catch(() => null),
    ]);
    setTodayCheckin(checkin);
    setTodayData(data);
  }, []);

  useEffect(() => {
    loadToday().finally(() => setLoadingCheckin(false));
  }, [loadToday]);

  useEffect(() => {
    return onDataChanged(() => { loadToday(); });
  }, [loadToday]);

  if (loadingCheckin || loadingAnalysis) {
    return (
      <AppShell title="EquilibraMente">
        <PageLoading />
      </AppShell>
    );
  }

  const currentLevel = analysis?.current?.load_level as LoadLevel | undefined;
  const tasksCompletedToday = todayData?.tasks.completed ?? 0;
  const tasksTotal = todayData?.tasks.total ?? 0;
  const activeStreak = todayData?.streak.current ?? 0;
  const completedToday = todayData?.tasks.completed ?? 0;

  return (
    <AppShell title="EquilibraMente">
      <div className="p-4 space-y-4">
        {/* Recommendation Banner — sticky at top when active */}
        <RecommendationBanner
          recommendations={recommendations}
          loadLevel={loadLevel as LoadLevel | null}
          onDismiss={dismiss}
          onAction={(_id) => router.push('/recomendaciones')}
        />

        {/* Check-in Section */}
        <section>
          {todayCheckin ? (
            <MoodStateBanner checkin={todayCheckin} onChange={() => setTodayCheckin(null)} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Como te sientes hoy?</h2>
              <MoodPicker onComplete={() => { loadToday(); }} />
            </div>
          )}
        </section>

        {/* Today's Activity Summary */}
        <section className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">{todayCheckin ? '✅' : '⬜'}</span>
            <span className="text-xs font-medium text-gray-700">Check-in</span>
            <span className="text-[10px] text-gray-400">
              {todayCheckin ? 'Hecho' : 'Pendiente'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">
              {completedToday > 0 ? '📝' : '⬜'}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {completedToday} de {tasksTotal}
            </span>
            <span className="text-[10px] text-gray-400">Tareas hoy</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-2xl">
              {activeStreak >= 30 ? '💎' : activeStreak >= 7 ? '⭐' : activeStreak >= 3 ? '🔥' : activeStreak > 0 ? '⚡' : '⬜'}
            </span>
            <span className="text-xs font-medium text-gray-700">{activeStreak} días</span>
            <span className="text-[10px] text-gray-400">Racha</span>
          </div>
        </section>

        {/* Load Analysis Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Carga Academica</h2>
            <Link href="/analisis" className="text-xs text-purple-600 hover:text-purple-700">
              Ver detalle →
            </Link>
          </div>

          <LoadIndicator level={currentLevel ?? null} score={analysis?.current?.load_score} />

          <StressAlert
            level={currentLevel ?? null}
            onAction={() => router.push('/recomendaciones')}
          />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/tareas"
            className="flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Mis Tareas</p>
              <p className="text-xs text-gray-500">Gestiona tus actividades</p>
            </div>
          </Link>
          <Link
            href="/regular"
            className="flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <span className="text-xl">🧘</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Regular</p>
              <p className="text-xs text-gray-500">Respiracion y audios</p>
            </div>
          </Link>
          <Link
            href="/logros"
            className="flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Logros</p>
              <p className="text-xs text-gray-500">Rachas y estadisticas</p>
            </div>
          </Link>
          <Link
            href="/reflexion"
            className="flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <span className="text-xl">💭</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Reflexion</p>
              <p className="text-xs text-gray-500">Tu diario personal</p>
            </div>
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
