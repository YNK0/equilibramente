'use client';

import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { ReflectionForm } from '@/modules/reflection/components/reflection-form';
import { useReflection } from '@/modules/reflection/hooks/use-reflection';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import Link from 'next/link';

export default function ReflexionPage() {
  const { hasTodayReflection, loading } = useReflection();

  if (loading) return <AppShell title="Reflexión"><PageLoading /></AppShell>;

  return (
    <AppShell title="Reflexión">
      {hasTodayReflection ? (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="text-5xl">🌱</span>
          <h3 className="text-xl font-semibold text-gray-900">
            Ya reflexionaste hoy
          </h3>
          <p className="text-sm text-gray-500">
            Cada reflexión te ayuda a conocerte mejor. Vuelve mañana.
          </p>
          <Link
            href="/reflexion/historial"
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Ver historial
          </Link>
        </div>
      ) : (
        <ReflectionForm />
      )}
    </AppShell>
  );
}
