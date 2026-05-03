'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/modules/shared/utils/cn';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inicio',   icon: '🏠' },
  { href: '/tareas',    label: 'Tareas',    icon: '📋' },
  { href: '/regular',   label: 'Regular',   icon: '🧘' },
  { href: '/logros',    label: 'Logros',    icon: '🏆' },
  { href: '/perfil',    label: 'Perfil',    icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors',
                isActive ? 'text-purple-600' : 'text-gray-400'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
