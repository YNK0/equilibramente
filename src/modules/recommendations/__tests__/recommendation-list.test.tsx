import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecommendationList } from '../components/recommendation-list';
import type { Recommendation } from '../types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

const mkRec = (id: string, priority: number): Recommendation =>
  ({
    id,
    category: 'pause',
    title: `Recommendation ${id}`,
    description: 'Test description',
    priority,
    is_active: true,
    trigger_condition: {},
    created_at: '2026-01-01T00:00:00Z',
  }) as Recommendation;

describe('RecommendationList', () => {
  it('shows loading skeleton when loading', () => {
    const { container } = render(
      <RecommendationList recommendations={[]} loadLevel={null} loading onDismiss={vi.fn()} />
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('shows empty state when no recommendations', () => {
    render(<RecommendationList recommendations={[]} loadLevel={null} onDismiss={vi.fn()} />);
    expect(screen.getByText('No hay recomendaciones por ahora')).toBeTruthy();
  });

  it('renders all recommendations', () => {
    const recs = [mkRec('1', 5), mkRec('2', 3)];
    render(<RecommendationList recommendations={recs} loadLevel="high" onDismiss={vi.fn()} />);
    expect(screen.getByText('Recommendation 1')).toBeTruthy();
    expect(screen.getByText('Recommendation 2')).toBeTruthy();
  });

  it('shows load level context when provided', () => {
    const recs = [mkRec('1', 5)];
    render(<RecommendationList recommendations={recs} loadLevel="critical" onDismiss={vi.fn()} />);
    expect(screen.getByText('Carga Critico')).toBeTruthy();
  });

  it('limits to 3 recommendations max', () => {
    const recs = [mkRec('1', 5), mkRec('2', 4), mkRec('3', 3), mkRec('4', 2)];
    render(<RecommendationList recommendations={recs} loadLevel="high" onDismiss={vi.fn()} />);
    expect(screen.getByText('Recommendation 1')).toBeTruthy();
    expect(screen.getByText('Recommendation 2')).toBeTruthy();
    expect(screen.getByText('Recommendation 3')).toBeTruthy();
    expect(screen.queryByText('Recommendation 4')).toBeNull();
  });
});
