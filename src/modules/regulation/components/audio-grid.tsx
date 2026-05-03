'use client';

import { CloudRain, Mic, Music, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { AudioResource } from '../types';
import { AudioPlayer } from './audio-player';

interface Props {
  audios: Array<AudioResource & { audio_url: string | null }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  nature: <CloudRain className="w-6 h-6" />,
  meditation: <Sparkles className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />,
  voice: <Mic className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  nature: 'bg-green-100 text-green-700',
  meditation: 'bg-purple-100 text-purple-700',
  music: 'bg-blue-100 text-blue-700',
  voice: 'bg-amber-100 text-amber-700',
};

export function AudioGrid({ audios }: Props) {
  const [selected, setSelected] = useState<(AudioResource & { audio_url: string | null }) | null>(
    null
  );

  if (selected?.audio_url) {
    return (
      <div className="p-4">
        <AudioPlayer
          audio={selected}
          audioUrl={selected.audio_url}
          onStop={() => setSelected(null)}
        />
      </div>
    );
  }

  if (audios.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No hay audios disponibles</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {audios.map((audio) => (
        <button
          key={audio.id}
          onClick={() => setSelected(audio)}
          className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${categoryColors[audio.category] || 'bg-gray-100 text-gray-600'}`}
          >
            {categoryIcons[audio.category] || <Music className="w-6 h-6" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 line-clamp-1">{audio.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {Math.round(audio.duration_seconds / 60)} min
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
            <Play className="w-4 h-4 text-purple-600 ml-0.5" />
          </div>
        </button>
      ))}
    </div>
  );
}
