import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodCard } from '../components/mood-card';
import { MOOD_CONFIGS } from '../constants';

describe('MoodCard', () => {
  const config = MOOD_CONFIGS.great;

  it('renders emoji and label', () => {
    render(
      <MoodCard config={config} onSelect={vi.fn()} disabled={false} isSelected={false} />
    );
    expect(screen.getByText('😊')).toBeTruthy();
    expect(screen.getByText('Bien')).toBeTruthy();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <MoodCard config={config} onSelect={onSelect} disabled={false} isSelected={false} />
    );
    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledWith('great');
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(
      <MoodCard config={config} onSelect={onSelect} disabled={true} isSelected={false} />
    );
    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('has aria-checked true when selected', () => {
    render(
      <MoodCard config={config} onSelect={vi.fn()} disabled={false} isSelected={true} />
    );
    expect(screen.getByRole('radio').getAttribute('aria-checked')).toBe('true');
  });

  it('renders all 4 mood configs', () => {
    const allConfigs = Object.values(MOOD_CONFIGS);
    expect(allConfigs).toHaveLength(4);
    expect(allConfigs.map((c) => c.value)).toEqual(['great', 'okay', 'stressed', 'overwhelmed']);
  });
});

describe('MOOD_CONFIGS', () => {
  it('each mood has required fields', () => {
    for (const config of Object.values(MOOD_CONFIGS)) {
      expect(config.emoji).toBeTruthy();
      expect(config.label).toBeTruthy();
      expect(config.color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('each mood has a unique color', () => {
    const colors = Object.values(MOOD_CONFIGS).map((c) => c.color);
    expect(new Set(colors).size).toBe(colors.length);
  });
});
