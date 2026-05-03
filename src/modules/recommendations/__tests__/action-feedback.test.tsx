import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionFeedback } from '../components/action-feedback';

describe('ActionFeedback', () => {
  it('renders feedback prompt', () => {
    render(<ActionFeedback onFeedback={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Te sirvio esto?')).toBeTruthy();
  });

  it('calls onFeedback with true when "Si, gracias" clicked', () => {
    const onFeedback = vi.fn();
    render(<ActionFeedback onFeedback={onFeedback} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Si, gracias'));
    expect(onFeedback).toHaveBeenCalledWith(true);
  });

  it('calls onFeedback with false when "No mucho" clicked', () => {
    const onFeedback = vi.fn();
    render(<ActionFeedback onFeedback={onFeedback} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('No mucho'));
    expect(onFeedback).toHaveBeenCalledWith(false);
  });

  it('calls onClose when "Cerrar sin votar" clicked', () => {
    const onClose = vi.fn();
    render(<ActionFeedback onFeedback={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cerrar sin votar'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('hides buttons after voting', () => {
    const { container } = render(<ActionFeedback onFeedback={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Si, gracias'));
    expect(screen.queryByText('Si, gracias')).toBeNull();
  });
});
