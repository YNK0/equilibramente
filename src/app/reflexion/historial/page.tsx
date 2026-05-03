'use client';

import { ReflectionHistory } from '@/modules/reflection/components/reflection-history';
import { AppShell } from '@/modules/shared/components/layout/app-shell';

export default function ReflexionHistorialPage() {
  return (
    <AppShell title="Historial de Reflexiones">
      <ReflectionHistory />
    </AppShell>
  );
}
