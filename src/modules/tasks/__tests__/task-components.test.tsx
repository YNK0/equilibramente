import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../components/task-card';
import { DifficultySelect } from '../components/difficulty-select';
import type { Task } from '../types';

const mkTask = (overrides: Partial<Task> = {}): Task =>
  ({
    id: 't1',
    user_id: 'u1',
    title: 'Estudiar calculo',
    description: null,
    difficulty: 'medium',
    status: 'pending',
    due_date: null,
    estimated_minutes: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }) as Task;

describe('TaskCard', () => {
  it('renders title and difficulty badge', () => {
    render(
      <TaskCard
        task={mkTask()}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={vi.fn()}
      />
    );
    expect(screen.getByText('Estudiar calculo')).toBeTruthy();
    expect(screen.getByText('Media')).toBeTruthy();
  });

  it('shows completed task with line-through', () => {
    render(
      <TaskCard
        task={mkTask({ status: 'completed' })}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={vi.fn()}
      />
    );
    const title = screen.getByText('Estudiar calculo');
    expect(title.className).toContain('line-through');
  });

  it('renders difficulty levels correctly', () => {
    const levels = [
      { difficulty: 'low' as const, label: 'Baja' },
      { difficulty: 'medium' as const, label: 'Media' },
      { difficulty: 'high' as const, label: 'Alta' },
    ];
    for (const { difficulty, label } of levels) {
      const { unmount } = render(
        <TaskCard
          task={mkTask({ difficulty })}
          onComplete={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStart={vi.fn()}
        />
      );
      expect(screen.getByText(label)).toBeTruthy();
      unmount();
    }
  });

  it('shows Empezar button for pending tasks', () => {
    render(
      <TaskCard
        task={mkTask()}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={vi.fn()}
      />
    );
    expect(screen.getByText('Empezar')).toBeTruthy();
  });

  it('does not show Empezar for completed tasks', () => {
    render(
      <TaskCard
        task={mkTask({ status: 'completed' })}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={vi.fn()}
      />
    );
    expect(screen.queryByText('Empezar')).toBeFalsy();
  });

  it('calls onStart when Empezar clicked', () => {
    const onStart = vi.fn();
    render(
      <TaskCard
        task={mkTask()}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStart={onStart}
      />
    );
    fireEvent.click(screen.getByText('Empezar'));
    expect(onStart).toHaveBeenCalledWith('t1');
  });
});

describe('DifficultySelect', () => {
  it('renders 3 levels', () => {
    render(<DifficultySelect value="medium" onChange={vi.fn()} />);
    expect(screen.getByText('Baja')).toBeTruthy();
    expect(screen.getByText('Media')).toBeTruthy();
    expect(screen.getByText('Alta')).toBeTruthy();
  });

  it('calls onChange when option clicked', () => {
    const onChange = vi.fn();
    render(<DifficultySelect value="medium" onChange={onChange} />);
    fireEvent.click(screen.getByText('Baja'));
    expect(onChange).toHaveBeenCalledWith('low');
  });
});
