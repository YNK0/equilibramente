import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProfileForm } from '../components/profile-form';
import type { Profile } from '../types';

const mkProfile = (): Profile =>
  ({
    id: 'user-1',
    display_name: 'Juan Perez',
    avatar_url: null,
    onboarding_completed: true,
    streak_hour: '20:00:00',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }) as Profile;

describe('ProfileForm', () => {
  it('renders display_name input with current value', () => {
    render(<ProfileForm profile={mkProfile()} onSave={vi.fn()} onCancel={vi.fn()} />);
    const input = screen.getByLabelText('Nombre') as HTMLInputElement;
    expect(input.value).toBe('Juan Perez');
  });

  it('calls onSave with trimmed name', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<ProfileForm profile={mkProfile()} onSave={onSave} onCancel={vi.fn()} />);

    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: '  Juan P.  ' } });
    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Juan P.');
    });
  });

  it('shows error when name is empty', () => {
    render(<ProfileForm profile={mkProfile()} onSave={vi.fn()} onCancel={vi.fn()} />);

    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('El nombre no puede estar vacio')).toBeTruthy();
  });

  it('shows error when name is only whitespace', () => {
    render(<ProfileForm profile={mkProfile()} onSave={vi.fn()} onCancel={vi.fn()} />);

    const input = screen.getByLabelText('Nombre');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('El nombre no puede estar vacio')).toBeTruthy();
  });

  it('calls onCancel when Cancelar clicked', () => {
    const onCancel = vi.fn();
    render(<ProfileForm profile={mkProfile()} onSave={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables inputs while saving', async () => {
    const onSave = vi.fn().mockImplementation(() => new Promise((r) => setTimeout(r, 100)));
    render(<ProfileForm profile={mkProfile()} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByText('Guardando...')).toBeTruthy();

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});
