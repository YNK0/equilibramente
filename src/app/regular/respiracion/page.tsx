'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { BreathingExercise } from '@/modules/regulation/components/breathing-exercise';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import type { BreathingPatternKey } from '@/modules/regulation/types';

function RespiracionContent() {
  const searchParams = useSearchParams();
  const pattern = (searchParams.get('pattern') as BreathingPatternKey) || '4-7-8';
  const loadAnalysisId = searchParams.get('load_analysis_id');

  return (
    <BreathingExercise
      pattern={pattern}
      loadAnalysisId={loadAnalysisId}
    />
  );
}

export default function RespiracionPage() {
  return (
    <AppShell title="Respiración guiada" showNav={false}>
      <Suspense fallback={<PageLoading />}>
        <RespiracionContent />
      </Suspense>
    </AppShell>
  );
}
