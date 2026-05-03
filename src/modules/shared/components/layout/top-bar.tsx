'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  title: string;
  back?: boolean;
  action?: { label: string; onClick: () => void };
}

export function TopBar({ title, back, action }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-12 px-4 max-w-lg mx-auto">
        <div className="w-16">
          {back && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm font-medium text-purple-600
                hover:text-purple-700 transition-colors min-h-[44px]"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        <div className="w-16 flex justify-end">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-purple-600 hover:text-purple-700
                transition-colors min-h-[44px]"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
