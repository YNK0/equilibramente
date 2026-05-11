'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type ReactNode, useEffect, useState } from 'react';
import { exitGuest, isGuest } from '@/lib/guest-mode';
import { ErrorBoundary } from '@/modules/shared/components/ui/error-boundary';
import { BottomNav } from './bottom-nav';
import { TopBar } from './top-bar';

interface Props {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppShell({ children, title, showNav = true }: Props) {
  const router = useRouter();
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    setGuest(isGuest());
  }, []);

  const handleExitGuest = () => {
    exitGuest();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-purple-50/30">
      {guest && (
        <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center justify-between px-4 py-2 max-w-lg mx-auto gap-2">
            <p className="text-xs text-amber-800 flex-1 min-w-0">
              <span className="font-semibold">Modo invitado</span> — datos volatiles, no se guardan al cerrar
            </p>
            <button
              onClick={handleExitGuest}
              className="text-xs font-medium text-red-600 hover:text-red-800 underline shrink-0"
            >
              Salir
            </button>
            <Link
              href="/auth/register"
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline shrink-0"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}
      {title && <TopBar title={title} />}
      <main className={`max-w-lg mx-auto ${showNav ? 'pb-20' : ''}`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
