'use client';

import { useState } from 'react';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import {
  LoadIndicator,
  StressAlert,
  LoadHistoryChart,
  LoadBreakdown,
  AnalysisEmpty,
  useLoadAnalysis,
  useLoadHistory,
} from '@/modules/analysis';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import { useRouter } from 'next/navigation';

export default function AnalisisPage() {
  const router = useRouter();
  const { analysis, loading, error } = useLoadAnalysis();
  const [historyDays] = useState(7);
  const { data: history, loading: historyLoading } = useLoadHistory(historyDays);

  if (loading) return <AppShell title="Analisis de Carga"><PageLoading /></AppShell>;

  if (error) {
    return (
      <AppShell title="Analisis de Carga">
        <div className="p-6 text-center">
          <p className="text-red-600 text-sm">No pudimos calcular tu carga. Reintenta.</p>
        </div>
      </AppShell>
    );
  }

  if (!analysis?.current) {
    return (
      <AppShell title="Analisis de Carga">
        <AnalysisEmpty />
      </AppShell>
    );
  }

  return (
    <AppShell title="Analisis de Carga">
      <div className="p-4 space-y-4">
        <LoadIndicator
          level={analysis.current.load_level as 'low' | 'moderate' | 'high' | 'critical'}
          loading={loading}
        />

        <StressAlert
          level={analysis.current.load_level as 'low' | 'moderate' | 'high' | 'critical'}
          onAction={() => router.push('/recomendaciones')}
        />

        {analysis.current && <LoadBreakdown analysis={analysis.current} />}

        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Historial</h3>
          <LoadHistoryChart data={history} loading={historyLoading} />
        </div>
      </div>
    </AppShell>
  );
}
