'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useState } from 'react';
import { isGuest } from '@/lib/guest-mode';
import { ErrorBoundary } from '@/modules/shared/components/ui/error-boundary';
import { BottomNav } from './bottom-nav';
import { TopBar } from './top-bar';

interface Props {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppShell({ children, title, showNav = true }: Props) {
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    setGuest(isGuest());
  }, []);

  return (
    <div className="min-h-screen bg-purple-50/30">
      {guest && (
        <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center justify-between px-4 py-2 max-w-lg mx-auto">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Modo invitado</span> — datos volatiles, no se guardan al cerrar
            </p>
            <Link
              href="/auth/register"
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline shrink-0 ml-3"
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
