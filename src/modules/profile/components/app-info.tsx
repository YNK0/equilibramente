'use client';

import { ChevronRight } from 'lucide-react';

interface Props {
  onLogout: () => void;
}

export function AppInfo({ onLogout }: Props) {
  return (
    <div className="divide-y divide-gray-100">
      <button
        onClick={() => {}}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <div>
          <p className="text-sm font-medium text-gray-900">Sobre EquilibraMente</p>
          <p className="text-xs text-gray-500 mt-0.5">Como funciona la app</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      <button
        onClick={() => {}}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <div>
          <p className="text-sm font-medium text-gray-900">Fundamentos teoricos</p>
          <p className="text-xs text-gray-500 mt-0.5">Zimmerman y Goleman</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <p className="text-sm font-medium text-red-500">Cerrar sesion</p>
        <ChevronRight className="h-4 w-4 text-red-400" />
      </button>
    </div>
  );
}
