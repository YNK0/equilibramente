import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadIndicator } from '../components/load-indicator';

describe('LoadIndicator', () => {
  it('shows loading skeleton when loading', () => {
    const { container } = render(<LoadIndicator level={null} loading />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('shows empty message when no level', () => {
    render(<LoadIndicator level={null} />);
    expect(screen.getByText(/Completa tu check-in/)).toBeTruthy();
  });

  it('renders low level with green label', () => {
    render(<LoadIndicator level="low" score={2} />);
    expect(screen.getByText('Carga: Tranquilo')).toBeTruthy();
  });

  it('renders moderate level with yellow label', () => {
    render(<LoadIndicator level="moderate" score={7} />);
    expect(screen.getByText('Carga: Moderado')).toBeTruthy();
  });

  it('renders high level with orange label', () => {
    render(<LoadIndicator level="high" score={14} />);
    expect(screen.getByText('Carga: Alto')).toBeTruthy();
  });

  it('renders critical level with red label', () => {
    render(<LoadIndicator level="critical" score={22} />);
    expect(screen.getByText('Carga: Critico')).toBeTruthy();
  });

  it('shows score when provided', () => {
    render(<LoadIndicator level="high" score={14.5} />);
    expect(screen.getByText('Score: 14.5')).toBeTruthy();
  });

  it('shows trend arrow when worsening', () => {
    render(<LoadIndicator level="high" score={14} trend="worsening" />);
    expect(screen.getByText('↑')).toBeTruthy();
  });

  it('shows trend arrow when improving', () => {
    render(<LoadIndicator level="moderate" score={5} trend="improving" />);
    expect(screen.getByText('↓')).toBeTruthy();
  });
});
