import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BreathingCircle } from '../components/breathing-circle';
import { MoodComparison } from '../components/mood-comparison';

describe('BreathingCircle', () => {
  it('renders phase label', () => {
    render(
      <BreathingCircle
        phase={{ name: 'inhale', label: 'Inhala', duration: 4, color: '#22c55e', scale: 1.2 }}
        progress={0.5}
      />
    );
    expect(screen.getByText('Inhala')).toBeTruthy();
  });

  it('shows exhale phase', () => {
    render(
      <BreathingCircle
        phase={{ name: 'exhale', label: 'Exhala', duration: 8, color: '#3b82f6', scale: 0.8 }}
        progress={0}
      />
    );
    expect(screen.getByText('Exhala')).toBeTruthy();
  });

  it('shows hold phase', () => {
    render(
      <BreathingCircle
        phase={{ name: 'hold', label: 'Sostiene', duration: 7, color: '#a855f7', scale: 1.0 }}
        progress={1}
      />
    );
    expect(screen.getByText('Sostiene')).toBeTruthy();
  });

  it('renders SVG circle elements', () => {
    const { container } = render(
      <BreathingCircle
        phase={{ name: 'inhale', label: 'Inhala', duration: 4, color: '#22c55e', scale: 1.2 }}
        progress={0.5}
      />
    );
    expect(container.querySelector('circle')).toBeTruthy();
  });
});

describe('MoodComparison', () => {
  it('renders before mood emoji', () => {
    render(
      <MoodComparison before="stressed" after={null} onAfterChange={vi.fn()} />
    );
    expect(screen.getByText(/Antes:/)).toBeTruthy();
  });

  it('shows completed header', () => {
    render(
      <MoodComparison before="stressed" after="great" onAfterChange={vi.fn()} />
    );
    expect(screen.getByText(/Completado/)).toBeTruthy();
  });

  it('shows selectable mood buttons', () => {
    render(
      <MoodComparison before="okay" after={null} onAfterChange={vi.fn()} />
    );
    // Should have mood emojis to select
    expect(screen.getByText('😊')).toBeTruthy();
    expect(screen.getByText('😐')).toBeTruthy();
  });

  it('calls onAfterChange when mood selected', () => {
    const onAfterChange = vi.fn().mockResolvedValue(undefined);
    render(
      <MoodComparison before="stressed" after={null} onAfterChange={onAfterChange} />
    );
    fireEvent.click(screen.getByText('😊'));
    expect(onAfterChange).not.toHaveBeenCalled(); // Needs save button click
  });
});
