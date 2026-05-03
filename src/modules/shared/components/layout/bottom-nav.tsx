'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/modules/shared/utils/cn';
import {
  Home,
  ListChecks,
  Heart,
  BarChart3,
  User,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/',        label: 'Inicio',   Icon: Home },
  { href: '/tareas',  label: 'Tareas',   Icon: ListChecks },
  { href: '/regular', label: 'Bienestar', Icon: Heart },
  { href: '/logros',  label: 'Progreso', Icon: BarChart3 },
  { href: '/perfil',  label: 'Perfil',   Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100
      bg-white/90 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href
            || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors',
                isActive ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-4
                  rounded-full bg-purple-600" />
              )}
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
