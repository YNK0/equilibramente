'use client';

import { Headphones, Pause, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActivePause } from '@/modules/regulation/components/active-pause';
import { AudioGrid } from '@/modules/regulation/components/audio-grid';
import { BreathingExercise } from '@/modules/regulation/components/breathing-exercise';
import { regulationService } from '@/modules/regulation/services/regulation-service';
import type { AudioResource, RegulationType } from '@/modules/regulation/types';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { PageLoading } from '@/modules/shared/components/ui/loading';

type View = 'menu' | RegulationType;

export default function RegularPage() {
  const [view, setView] = useState<View>('menu');
  const [audios, setAudios] = useState<(AudioResource & { audio_url: string | null })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === 'audio') {
      setLoading(true);
      regulationService.getAudios().then(async (data) => {
        const withUrls = await Promise.all(
          data.map(async (a) => ({
            ...a,
            audio_url: await regulationService.getSignedUrl(a.storage_path),
          }))
        );
        setAudios(withUrls);
      }).finally(() => setLoading(false));
    }
  }, [view]);

  if (view === 'breathing') {
    return (
      <AppShell title="Respiración guiada" showNav={false}>
        <BreathingExercise onComplete={() => setView('menu')} />
      </AppShell>
    );
  }

  if (view === 'audio') {
    return (
      <AppShell title="Audios relajantes">
        {loading ? <PageLoading /> : <AudioGrid audios={audios} />}
      </AppShell>
    );
  }

  if (view === 'active_pause') {
    return (
      <AppShell title="Pausa activa" showNav={false}>
        <ActivePause />
      </AppShell>
    );
  }

  return (
    <AppShell title="Bienestar">
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-500">
          Herramientas para reducir el estrés y recuperar la calma.
        </p>

        <button
          onClick={() => setView('breathing')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Wind className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Respiración guiada</p>
            <p className="text-xs text-gray-400">Ejercicios de 1-2 minutos con animación</p>
          </div>
        </button>

        <button
          onClick={() => setView('audio')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Audios relajantes</p>
            <p className="text-xs text-gray-400">Sonidos de naturaleza y meditación</p>
          </div>
        </button>

        <button
          onClick={() => setView('active_pause')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-200 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Pause className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Pausa activa</p>
            <p className="text-xs text-gray-400">Estiramientos y ejercicios breves</p>
          </div>
        </button>
      </div>
    </AppShell>
  );
}
