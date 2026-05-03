import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecommendationCard } from '../components/recommendation-card';
import type { Recommendation } from '../types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

const mkRec = (overrides: Partial<Recommendation> = {}): Recommendation =>
  ({
    id: '1',
    category: 'task_management',
    title: 'Divide y venceras',
    description: 'Divide la tarea en 3 pasos',
    priority: 5,
    is_active: true,
    trigger_condition: { load_level: ['high', 'critical'] },
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }) as Recommendation;

describe('RecommendationCard', () => {
  it('renders title and description', () => {
    render(<RecommendationCard recommendation={mkRec()} onDismiss={vi.fn()} />);
    expect(screen.getByText('Divide y venceras')).toBeTruthy();
    expect(screen.getByText('Divide la tarea en 3 pasos')).toBeTruthy();
  });

  it('shows action button with correct label for task_management', () => {
    render(
      <RecommendationCard
        recommendation={mkRec({ category: 'task_management' })}
        onDismiss={vi.fn()}
      />
    );
    expect(screen.getByText('Ver mis tareas')).toBeTruthy();
  });

  it('shows action button for emotional category', () => {
    render(
      <RecommendationCard recommendation={mkRec({ category: 'emotional' })} onDismiss={vi.fn()} />
    );
    expect(screen.getByText('Iniciar respiracion')).toBeTruthy();
  });

  it('navigates to correct route on action tap', () => {
    render(
      <RecommendationCard
        recommendation={mkRec({ category: 'task_management' })}
        onDismiss={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Ver mis tareas'));
    expect(mockPush).toHaveBeenCalledWith('/tareas');
  });

  it('calls onDismiss when Ignorar clicked', () => {
    const onDismiss = vi.fn();
    render(<RecommendationCard recommendation={mkRec()} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText('Ignorar'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('shows priority dots', () => {
    const { container } = render(
      <RecommendationCard recommendation={mkRec({ priority: 3 })} onDismiss={vi.fn()} />
    );
    const dots = container.querySelectorAll('.w-1.h-3');
    expect(dots.length).toBe(3);
  });
});
