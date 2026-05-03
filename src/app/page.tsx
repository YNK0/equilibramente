import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { EmptyState } from '@/modules/shared/components/ui/empty-state';

export default function DashboardPage() {
  return (
    <AppShell title="Inicio">
      <div className="p-4 space-y-4">
        {/* Today summary card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Hoy
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Buen dia
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Registra como te sientes para empezar
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
            active:scale-[0.98] transition-transform cursor-pointer">
            <span className="text-3xl">&#128522;</span>
            <p className="mt-2 text-sm font-medium text-gray-900">Check-in</p>
            <p className="text-xs text-gray-400">Como te sientes?</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
            active:scale-[0.98] transition-transform cursor-pointer">
            <span className="text-3xl">&#128221;</span>
            <p className="mt-2 text-sm font-medium text-gray-900">Tareas</p>
            <p className="text-xs text-gray-400">Organiza tu dia</p>
          </div>
        </div>

        {/* Empty state placeholder */}
        <EmptyState
          icon="&#129504;"
          title="Empieza tu viaje"
          description="Haz tu primer check-in emocional para comenzar a ver tu progreso y recibir recomendaciones personalizadas."
        />
      </div>
    </AppShell>
  );
}
