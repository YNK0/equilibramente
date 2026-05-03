import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/star-rating';
import { QuestionPrompt } from '../components/question-prompt';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    render(<StarRating value={0} onChange={vi.fn()} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  it('calls onChange with selected star', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('toggles star off when clicking same value', () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('shows filled stars for current value', () => {
    render(<StarRating value={4} onChange={vi.fn()} />);
    const stars = screen.getAllByRole('button');
    for (let i = 0; i < 4; i++) {
      expect(stars[i].textContent).toBe('⭐');
    }
    expect(stars[4].textContent).toBe('☆');
  });

  it('shows all empty stars when value is 0', () => {
    render(<StarRating value={0} onChange={vi.fn()} />);
    const stars = screen.getAllByRole('button');
    for (const star of stars) {
      expect(star.textContent).toBe('☆');
    }
  });

  it('shows label when value > 0', () => {
    render(<StarRating value={3} onChange={vi.fn()} />);
    expect(screen.getByText('Normal')).toBeTruthy();
  });

  it('has aria-labels', () => {
    render(<StarRating value={0} onChange={vi.fn()} />);
    expect(screen.getByLabelText('1 estrella')).toBeTruthy();
    expect(screen.getByLabelText('5 estrellas')).toBeTruthy();
  });
});

const mkPromptProps = (overrides = {}) => ({
  question: 'Como estuvo tu dia?',
  placeholder: 'Escribe aqui...',
  value: '',
  onChange: vi.fn(),
  onNext: vi.fn(),
  onSkip: vi.fn(),
  step: 1,
  total: 3,
  ...overrides,
});

describe('QuestionPrompt', () => {
  it('renders question and textarea', () => {
    render(<QuestionPrompt {...mkPromptProps()} />);
    expect(screen.getByText('Como estuvo tu dia?')).toBeTruthy();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<QuestionPrompt {...mkPromptProps({ onChange })} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bien' } });
    expect(onChange).toHaveBeenCalledWith('Bien');
  });

  it('shows character counter', () => {
    render(<QuestionPrompt {...mkPromptProps({ value: 'Hola', maxLength: 200 })} />);
    expect(screen.getByText('4/200')).toBeTruthy();
  });

  it('shows step counter', () => {
    render(<QuestionPrompt {...mkPromptProps({ step: 2, total: 3 })} />);
    expect(screen.getByText('Pregunta 2 de 3')).toBeTruthy();
  });

  it('calls onSkip when Saltar clicked', () => {
    const onSkip = vi.fn();
    render(<QuestionPrompt {...mkPromptProps({ onSkip })} />);
    fireEvent.click(screen.getByText('Saltar'));
    expect(onSkip).toHaveBeenCalled();
  });

  it('calls onNext when Siguiente clicked', () => {
    const onNext = vi.fn();
    render(<QuestionPrompt {...mkPromptProps({ onNext })} />);
    fireEvent.click(screen.getByText('Siguiente'));
    expect(onNext).toHaveBeenCalled();
  });
});
