'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadIndicator } from '@/modules/analysis/components/load-indicator';
import { StressAlert } from '@/modules/analysis/components/stress-alert';
import { useLoadAnalysis } from '@/modules/analysis/hooks/use-load-analysis';
import type { LoadLevel } from '@/modules/analysis/types';
import { MoodPicker } from '@/modules/emotional/components/mood-picker';
import { MoodStateBanner } from '@/modules/emotional/components/mood-state-banner';
import { emotionalService } from '@/modules/emotional/services/emotional-service';
import type { EmotionalCheckin } from '@/modules/emotional/types';
import { RecommendationBanner } from '@/modules/recommendations/components/recommendation-banner';
import { useRecommendations } from '@/modules/recommendations/hooks/use-recommendations';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { PageLoading } from '@/modules/shared/components/ui/loading';

export default function DashboardPage() {
  const router = useRouter();
  const [todayCheckin, setTodayCheckin] = useState<EmotionalCheckin | null>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(true);
  const { analysis, loading: loadingAnalysis } = useLoadAnalysis();
  const { recommendations, loadLevel, dismiss, sendFeedback } = useRecommendations();

  useEffect(() => {
    emotionalService
      .getToday()
      .then(setTodayCheckin)
      .finally(() => setLoadingCheckin(false));
  }, []);

  if (loadingCheckin || loadingAnalysis) {
    return (
      <AppShell title="EquilibraMente">
        <PageLoading />
      </AppShell>
    );
  }

  const currentLevel = analysis?.current?.load_level as LoadLevel | undefined;

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
              <MoodPicker
                onComplete={() => {
                  emotionalService.getToday().then(setTodayCheckin);
                }}
              />
            </div>
          )}
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
