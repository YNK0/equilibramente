import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodaySummary } from '../components/today-summary';
import { StreakRow } from '../components/streak-row';
import { MoodSparkline } from '../components/mood-sparkline';

describe('TodaySummary', () => {
  it('TodaySummary.Mood renders mood emoji', () => {
    render(<TodaySummary.Mood mood="okay" />);
    expect(screen.getByText('😐')).toBeTruthy();
  });

  it('TodaySummary.Mood shows placeholder when no mood', () => {
    render(<TodaySummary.Mood mood={null} />);
    expect(screen.getByText('❓')).toBeTruthy();
    expect(screen.getByText('Sin registro')).toBeTruthy();
  });

  it('TodaySummary.Mood shows Hoy label', () => {
    render(<TodaySummary.Mood mood="great" />);
    expect(screen.getByText('Hoy')).toBeTruthy();
  });

  it('TodaySummary.Tasks shows completed/total', () => {
    render(<TodaySummary.Tasks completed={3} total={5} />);
    expect(screen.getByText('3 de 5')).toBeTruthy();
  });
});

describe('StreakRow', () => {
  it('renders current streak count', () => {
    render(<StreakRow current={5} longest={12} weekDays={[]} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows longest streak', () => {
    render(<StreakRow current={3} longest={12} weekDays={[]} />);
    expect(screen.getByText(/Mejor racha: 12/)).toBeTruthy();
  });

  it('renders 7 day slots', () => {
    render(
      <StreakRow
        current={5}
        longest={12}
        weekDays={[true, true, true, true, true, false, false]}
      />
    );
    const checks = screen.getAllByText('✓');
    expect(checks.length).toBe(5);
  });

  it('shows day labels', () => {
    render(<StreakRow current={3} longest={7} weekDays={[]} />);
    expect(screen.getByText('L')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
  });
});

describe('MoodSparkline', () => {
  it('renders SVG element with 2+ data points', () => {
    render(
      <MoodSparkline
        days={[
          { date: '2026-01-01', mood: 'great' },
          { date: '2026-01-02', mood: 'okay' },
        ]}
        trend="stable"
      />
    );
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('shows improving trend', () => {
    render(
      <MoodSparkline
        days={[
          { date: '2026-01-01', mood: 'stressed' },
          { date: '2026-01-02', mood: 'great' },
        ]}
        trend="improving"
      />
    );
    expect(screen.getByText(/Mejorando/)).toBeTruthy();
  });

  it('shows worsening trend', () => {
    render(
      <MoodSparkline
        days={[
          { date: '2026-01-01', mood: 'great' },
          { date: '2026-01-02', mood: 'stressed' },
        ]}
        trend="worsening"
      />
    );
    expect(screen.getByText(/Empeorando/)).toBeTruthy();
  });

  it('shows empty message when no mood data', () => {
    render(<MoodSparkline days={[]} trend="stable" />);
    expect(screen.getByText(/Registra tu estado/)).toBeTruthy();
  });
});
