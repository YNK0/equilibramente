'use client';

import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { RecommendationList, useRecommendations } from '@/modules/recommendations';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import type { LoadLevel } from '@/modules/analysis/types';

export default function RecomendacionesPage() {
  const { recommendations, loadLevel, loading, error, dismiss, sendFeedback } =
    useRecommendations();

  if (loading) return <AppShell title="Recomendaciones"><PageLoading /></AppShell>;

  return (
    <AppShell title="Recomendaciones">
      <div className="p-4">
        {error && (
          <p className="text-sm text-red-600 mb-3">No pudimos cargar las recomendaciones.</p>
        )}

        <RecommendationList
          recommendations={recommendations}
          loadLevel={loadLevel as LoadLevel | null}
          loading={loading}
          onDismiss={dismiss}
          onAction={(id) => sendFeedback(id, '', null, null)}
        />
      </div>
    </AppShell>
  );
}
