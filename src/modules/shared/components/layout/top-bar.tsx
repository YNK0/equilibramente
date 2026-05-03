'use client';

import { useRouter } from 'next/navigation';

interface Props {
  title: string;
  back?: boolean;
  action?: { label: string; onClick: () => void };
}

export function TopBar({ title, back, action }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="w-16">
          {back && (
            <button
              onClick={() => router.back()}
              className="text-purple-600 text-sm font-medium"
              aria-label="Volver"
            >
              ← Volver
            </button>
          )}
        </div>
        <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
        <div className="w-16 flex justify-end">
          {action && (
            <button
              onClick={action.onClick}
              className="text-purple-600 text-sm font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
