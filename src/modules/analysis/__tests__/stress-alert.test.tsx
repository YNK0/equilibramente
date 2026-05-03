import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StressAlert } from '../components/stress-alert';

describe('StressAlert', () => {
  it('does not render when level is low', () => {
    const { container } = render(<StressAlert level="low" />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when level is moderate', () => {
    const { container } = render(<StressAlert level="moderate" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders alert for high level', () => {
    render(<StressAlert level="high" />);
    expect(screen.getByText('Carga alta detectada')).toBeTruthy();
  });

  it('renders alert for critical level', () => {
    render(<StressAlert level="critical" />);
    expect(screen.getByText('Carga critica detectada')).toBeTruthy();
  });

  it('shows action button when onAction provided', () => {
    const onAction = vi.fn();
    render(<StressAlert level="high" onAction={onAction} />);
    const btn = screen.getByText('Ver recomendaciones');
    fireEvent.click(btn);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('shows dismiss button when onDismiss provided', () => {
    const onDismiss = vi.fn();
    render(<StressAlert level="high" onDismiss={onDismiss} />);
    const btn = screen.getByText('Entendido');
    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('uses red styles for critical level', () => {
    render(<StressAlert level="critical" />);
    const alert = screen.getByText('Carga critica detectada').closest('div');
    // Parent container should have red bg
    expect(alert?.parentElement?.parentElement?.className).toContain('bg-red-50');
  });
});
