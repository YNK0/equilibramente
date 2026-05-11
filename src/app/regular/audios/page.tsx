'use client';

import { useEffect, useState } from 'react';
import { AudioGrid } from '@/modules/regulation/components/audio-grid';
import { regulationService } from '@/modules/regulation/services/regulation-service';
import type { AudioResource } from '@/modules/regulation/types';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { PageLoading } from '@/modules/shared/components/ui/loading';

export default function AudiosPage() {
  const [audios, setAudios] = useState<(AudioResource & { audio_url: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    regulationService.getAudios().then(async (data) => {
      const withUrls = await Promise.all(
        data.map(async (a) => ({
          ...a,
          audio_url: await regulationService.getSignedUrl(a.storage_path),
        }))
      );
      setAudios(withUrls);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Audios relajantes">
      {loading ? <PageLoading /> : <AudioGrid audios={audios} />}
    </AppShell>
  );
}
