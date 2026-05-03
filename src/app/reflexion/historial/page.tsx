'use client';

import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { ReflectionHistory } from '@/modules/reflection/components/reflection-history';

export default function ReflexionHistorialPage() {
  return (
    <AppShell title="Historial de Reflexiones">
      <ReflectionHistory />
    </AppShell>
  );
}
