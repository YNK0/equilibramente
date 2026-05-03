'use client';

import { useEffect, useState } from 'react';
import { AudioGrid } from '@/modules/regulation/components/audio-grid';
import type { AudioResource } from '@/modules/regulation/types';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { PageLoading } from '@/modules/shared/components/ui/loading';

export default function AudiosPage() {
  const [audios, setAudios] = useState<(AudioResource & { audio_url: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/regulation/audios')
      .then((r) => r.json())
      .then((d) => setAudios(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Audios relajantes">
      {loading ? <PageLoading /> : <AudioGrid audios={audios} />}
    </AppShell>
  );
}
