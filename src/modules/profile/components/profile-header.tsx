'use client';

import { Avatar } from '@/components/ui/avatar';
import type { Profile } from '../types';

interface Props {
  profile: Profile;
  email?: string;
  onEdit: () => void;
}

export function ProfileHeader({ profile, email, onEdit }: Props) {
  const initials = (profile.display_name || email || '?')
    .split(/[\s@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <Avatar className="h-20 w-20">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.display_name} className="object-cover" />
        ) : (
          <span className="text-2xl font-semibold text-purple-600">{initials}</span>
        )}
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">{profile.display_name}</h2>
        {email && <p className="text-sm text-gray-500 mt-0.5">{email}</p>}
      </div>

      <button
        onClick={onEdit}
        className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600
          hover:bg-purple-100 transition-colors"
      >
        Editar perfil
      </button>
    </div>
  );
}
