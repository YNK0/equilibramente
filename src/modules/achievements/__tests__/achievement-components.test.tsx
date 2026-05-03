import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementBadge } from '../components/achievement-badge';
import { ProgressRing } from '../components/progress-ring';
import { StreakBar } from '../components/streak-bar';
import type { Achievement } from '../types';

const mkAchievement = (overrides: Partial<Achievement> = {}): Achievement =>
  ({
    id: 'a1',
    key: 'first_task',
    title: 'Primera tarea',
    description: 'Registrar tu primera tarea',
    icon: '📝',
    category: 'tasks',
    tier: 1,
    requirement: {},
    unlocked: false,
    unlocked_at: null,
    progress: null,
    ...overrides,
  }) as Achievement;

describe('AchievementBadge', () => {
  it('renders icon and title for locked achievement', () => {
    render(<AchievementBadge achievement={mkAchievement()} />);
    expect(screen.getByText('📝')).toBeTruthy();
    expect(screen.getByText('Primera tarea')).toBeTruthy();
  });

  it('is disabled when locked', () => {
    render(<AchievementBadge achievement={mkAchievement()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when unlocked', () => {
    render(
      <AchievementBadge
        achievement={mkAchievement({ unlocked: true, unlocked_at: '2026-01-15T00:00:00Z' })}
      />
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('has lock emoji when locked', () => {
    render(<AchievementBadge achievement={mkAchievement()} />);
    expect(screen.getByText('🔒')).toBeTruthy();
  });
});

describe('ProgressRing', () => {
  it('shows unlocked count', () => {
    render(<ProgressRing unlocked={5} total={10} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows total after slash', () => {
    render(<ProgressRing unlocked={5} total={10} />);
    expect(screen.getByText('/ 10')).toBeTruthy();
  });

  it('shows 0 unlocked correctly', () => {
    render(<ProgressRing unlocked={0} total={10} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('renders SVG with two circles', () => {
    const { container } = render(<ProgressRing unlocked={5} total={10} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });
});

describe('StreakBar', () => {
  it('renders 7 day indicators', () => {
    const days = [true, true, false, true, true, true, false];
    const { container } = render(<StreakBar days={days} />);
    const indicators = container.querySelectorAll('.h-8.w-8');
    expect(indicators.length).toBe(7);
  });

  it('shows checkmark for completed days', () => {
    const days = [true, true, true, true, true, true, true];
    render(<StreakBar days={days} />);
    const checks = screen.getAllByText('✓');
    expect(checks.length).toBe(7);
  });

  it('shows day letter for incomplete days', () => {
    const days = [false, false, false, false, false, false, false];
    render(<StreakBar days={days} />);
    expect(screen.getByText('L')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
  });

  it('uses green background for completed', () => {
    const days = [true, false, false, false, false, false, false];
    const { container } = render(<StreakBar days={days} />);
    expect(container.querySelector('.bg-green-100')).toBeTruthy();
    expect(container.querySelector('.bg-gray-100')).toBeTruthy();
  });
});
