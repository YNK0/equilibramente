'use client';

import { Pause, Play, Square } from 'lucide-react';
import { useAudio } from '../hooks/use-audio';
import type { AudioResource } from '../types';

interface Props {
  audio: AudioResource;
  audioUrl: string;
  onStop?: () => void;
}

export function AudioPlayer({ audio, audioUrl, onStop }: Props) {
  const { isPlaying, isLoading, currentTime, duration, error, play, pause, resume, stop } =
    useAudio();

  const handleToggle = () => {
    if (isLoading) return;
    if (isPlaying) {
      pause();
    } else if (currentTime > 0) {
      resume();
    } else {
      play(audioUrl);
    }
  };

  const handleStop = () => {
    stop();
    onStop?.();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{audio.title}</p>
          <p className="text-xs text-gray-400">
            {isPlaying ? formatTime(currentTime) : formatTime(duration)} · {audio.category}
          </p>
          <div className="mt-1 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleStop}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
