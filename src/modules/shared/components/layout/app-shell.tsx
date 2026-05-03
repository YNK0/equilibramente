'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/modules/shared/components/ui/error-boundary';
import { BottomNav } from './bottom-nav';
import { TopBar } from './top-bar';

interface Props {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppShell({ children, title, showNav = true }: Props) {
  return (
    <div className="min-h-screen bg-purple-50/30">
      {title && <TopBar title={title} />}
      <main className={`max-w-lg mx-auto ${showNav ? 'pb-20' : ''}`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
