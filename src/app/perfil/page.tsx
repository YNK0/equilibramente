'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import {
  AppInfo,
  NotificationToggles,
  ProfileForm,
  ProfileHeader,
  QuietHoursPicker,
  StatsSummary,
  useNotificationPrefs,
  useProfile,
} from '@/modules/profile';
import { AppShell, LoadingSpinner, TopBar, useToast } from '@/modules/shared';

export default function PerfilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, stats, loading, update } = useProfile();
  const { prefs, loading: prefsLoading, update: updatePrefs } = useNotificationPrefs();
  const [editing, setEditing] = useState(false);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  }, [router]);

  const handleSaveName = useCallback(
    async (displayName: string) => {
      await update({ display_name: displayName });
      setEditing(false);
      toast('Perfil actualizado');
    },
    [update, toast]
  );

  const handleToggle = useCallback(
    async (key: string, value: boolean) => {
      await updatePrefs({ [key]: value });
    },
    [updatePrefs]
  );

  const handleQuietHours = useCallback(
    async (start: string, end: string) => {
      await updatePrefs({ quiet_hours_start: start, quiet_hours_end: end });
      toast('Horas silenciosas actualizadas');
    },
    [updatePrefs, toast]
  );

  if (loading || prefsLoading) {
    return (
      <AppShell>
        <TopBar title="Perfil" />
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!profile || !prefs) {
    return (
      <AppShell>
        <TopBar title="Perfil" />
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">Error al cargar el perfil</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title="Perfil" />

      <div className="max-w-lg mx-auto">
        {editing ? (
          <div className="p-4">
            <ProfileForm
              profile={profile}
              onSave={handleSaveName}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <ProfileHeader profile={profile} onEdit={() => setEditing(true)} />
        )}

        <div className="px-4">
          <Separator />

          <section className="py-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide py-2">
              Notificaciones
            </h3>
            <NotificationToggles prefs={prefs} onToggle={handleToggle} disabled={false} />
          </section>

          <Separator />

          <section className="py-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide py-2">
              Horario
            </h3>
            <QuietHoursPicker
              start={prefs.quiet_hours_start}
              end={prefs.quiet_hours_end}
              onChange={handleQuietHours}
              disabled={false}
            />
          </section>

          <Separator />

          <section className="py-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide py-2">
              Estadisticas
            </h3>
            {stats && <StatsSummary stats={stats} />}
          </section>

          <Separator />

          <section className="py-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide py-2">App</h3>
            <AppInfo onLogout={handleLogout} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
