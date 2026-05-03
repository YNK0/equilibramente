'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '../types';

interface Props {
  profile: Profile;
  onSave: (displayName: string) => Promise<void>;
  onCancel: () => void;
}

export function ProfileForm({ profile, onSave, onCancel }: Props) {
  const [name, setName] = useState(profile.display_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre no puede estar vacio');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await onSave(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="display_name">Nombre</Label>
        <Input
          id="display_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          maxLength={50}
          className="mt-1"
          disabled={saving}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
