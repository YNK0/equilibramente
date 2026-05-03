import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationToggles } from '../components/notification-toggles';
import type { NotificationPrefs } from '../types';

vi.mock('@/lib/notifications/push', () => ({
  subscribeToPush: vi.fn().mockResolvedValue({ endpoint: 'https://test.push.com' }),
  pushSupported: vi.fn().mockReturnValue(true),
}));

const mkPrefs = (overrides: Partial<NotificationPrefs> = {}): NotificationPrefs =>
  ({
    id: 'np-1',
    user_id: 'user-1',
    checkin_reminder: true,
    task_reminder: true,
    stress_alert: true,
    achievement_notify: true,
    quiet_hours_start: '22:00:00',
    quiet_hours_end: '07:00:00',
    push_subscription: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }) as NotificationPrefs;

describe('NotificationToggles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 4 toggle options', () => {
    render(<NotificationToggles prefs={mkPrefs()} onToggle={vi.fn()} disabled={false} />);
    expect(screen.getByText('Recordatorio de check-in')).toBeTruthy();
    expect(screen.getByText('Recordatorio de tareas')).toBeTruthy();
    expect(screen.getByText('Alerta de estres')).toBeTruthy();
    expect(screen.getByText('Logros desbloqueados')).toBeTruthy();
  });

  it('shows all toggles on when prefs are true', () => {
    render(<NotificationToggles prefs={mkPrefs()} onToggle={vi.fn()} disabled={false} />);
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(4);
    for (const s of switches) {
      expect(s.getAttribute('aria-checked')).toBe('true');
    }
  });

  it('shows toggle off when pref is false', () => {
    render(
      <NotificationToggles
        prefs={mkPrefs({ checkin_reminder: false, task_reminder: false })}
        onToggle={vi.fn()}
        disabled={false}
      />
    );
    const switches = screen.getAllByRole('switch');
    const checked = switches.filter((s) => s.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(2);
  });

  it('calls onToggle when switch clicked', () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    render(<NotificationToggles prefs={mkPrefs()} onToggle={onToggle} disabled={false} />);

    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);
    expect(onToggle).toHaveBeenCalledWith('checkin_reminder', false);
  });

  it('disables toggles when disabled prop is true', () => {
    render(<NotificationToggles prefs={mkPrefs()} onToggle={vi.fn()} disabled={true} />);
    const switches = screen.getAllByRole('switch');
    for (const s of switches) {
      expect(s).toBeDisabled();
    }
  });

  it('shows descriptions for each toggle', () => {
    render(<NotificationToggles prefs={mkPrefs()} onToggle={vi.fn()} disabled={false} />);
    expect(screen.getByText('Recordatorio diario para registrar tu estado emocional')).toBeTruthy();
    expect(screen.getByText('Tareas proximas a su fecha de entrega')).toBeTruthy();
  });
});
