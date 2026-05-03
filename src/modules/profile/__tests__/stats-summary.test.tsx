import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsSummary } from '../components/stats-summary';
import type { ProfileStats } from '../types';

const mkStats = (overrides: Partial<ProfileStats> = {}): ProfileStats => ({
  total_days: 45,
  total_checkins: 38,
  total_tasks_completed: 127,
  total_regulation_minutes: 510,
  achievements_unlocked: 8,
  achievements_total: 16,
  longest_streak: 12,
  ...overrides,
});

describe('StatsSummary', () => {
  it('renders all stat values', () => {
    render(<StatsSummary stats={mkStats()} />);
    expect(screen.getByText('45')).toBeTruthy();
    expect(screen.getByText('38')).toBeTruthy();
    expect(screen.getByText('127')).toBeTruthy();
    expect(screen.getByText('8h 30m')).toBeTruthy();
    expect(screen.getByText('8/16')).toBeTruthy();
    expect(screen.getByText('12 dias')).toBeTruthy();
  });

  it('renders all stat labels', () => {
    render(<StatsSummary stats={mkStats()} />);
    expect(screen.getByText('Dias usando la app')).toBeTruthy();
    expect(screen.getByText('Check-ins')).toBeTruthy();
    expect(screen.getByText('Tareas completadas')).toBeTruthy();
    expect(screen.getByText('Tiempo en regulacion')).toBeTruthy();
    expect(screen.getByText('Logros')).toBeTruthy();
    expect(screen.getByText('Mejor racha')).toBeTruthy();
  });

  it('shows zero values correctly', () => {
    render(
      <StatsSummary stats={mkStats({ total_days: 0, total_checkins: 0, longest_streak: 0 })} />
    );
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('formats regulation minutes under 60', () => {
    render(<StatsSummary stats={mkStats({ total_regulation_minutes: 45 })} />);
    expect(screen.getByText('45m')).toBeTruthy();
  });

  it('shows unlocked/total format for achievements', () => {
    render(<StatsSummary stats={mkStats({ achievements_unlocked: 5, achievements_total: 20 })} />);
    expect(screen.getByText('5/20')).toBeTruthy();
  });
});
