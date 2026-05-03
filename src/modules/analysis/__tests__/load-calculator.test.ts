import { describe, expect, it } from 'vitest';
import { calculateLoad, computeTrend, getLoadLevel } from '../utils/load-calculator';

const mkTasks = (
  tasks: { difficulty: 'low' | 'medium' | 'high'; status?: string; due_date?: string | null }[]
) =>
  tasks.map((t) => ({
    difficulty: t.difficulty,
    status: t.status ?? 'pending',
    due_date: t.due_date ?? null,
  }));

describe('calculateLoad', () => {
  // Zero tasks
  it('returns low with 0 tasks and great mood', () => {
    const r = calculateLoad({ tasks: [], lastCheckin: { mood: 'great' } });
    expect(r.level).toBe('low');
    expect(r.score).toBe(0);
    expect(r.highDifficultyCount).toBe(0);
  });

  it('returns low with 0 tasks and overwhelmed mood', () => {
    const r = calculateLoad({ tasks: [], lastCheckin: { mood: 'overwhelmed' } });
    expect(r.level).toBe('low');
    expect(r.score).toBe(0);
  });

  // Basic difficulty
  it('returns low with 1 low task and great mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: { mood: 'great' },
    });
    expect(r.level).toBe('low');
    expect(r.score).toBe(0.8); // 1.0 * 0.85 = 0.85, toFixed(1) rounds down (IEEE 754)
  });

  it('returns moderate with 3 medium tasks and okay mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([
        { difficulty: 'medium' },
        { difficulty: 'medium' },
        { difficulty: 'medium' },
      ]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.level).toBe('moderate');
    expect(r.score).toBe(6.0); // (2+2+2) * 1.0
  });

  it('returns high with 3 high tasks and stressed mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'high' }, { difficulty: 'high' }, { difficulty: 'high' }]),
      lastCheckin: { mood: 'stressed' },
    });
    expect(r.level).toBe('high');
    expect(r.score).toBe(12.6); // (3.5+3.5+3.5) * 1.2 = 12.6
  });

  it('returns critical with 5 high tasks all within 24h + overwhelmed', () => {
    const tomorrow = new Date(Date.now() + 12 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([
        { difficulty: 'high', due_date: tomorrow },
        { difficulty: 'high', due_date: tomorrow },
        { difficulty: 'high', due_date: tomorrow },
        { difficulty: 'high', due_date: tomorrow },
        { difficulty: 'high', due_date: tomorrow },
      ]),
      lastCheckin: { mood: 'overwhelmed' },
    });
    expect(r.level).toBe('critical');
    // taskLoad = 3.5*5 = 17.5, urgency = 1.5*5 = 7.5, mood = 1.5
    // (17.5 + 7.5) * 1.5 = 37.5
    expect(r.score).toBe(37.5);
  });

  // Urgency bonuses
  it('adds 2.0 bonus for task due within 6h', () => {
    const soon = new Date(Date.now() + 3 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low', due_date: soon }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(2.0);
  });

  it('adds 1.5 bonus for task due within 24h', () => {
    const soon = new Date(Date.now() + 12 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low', due_date: soon }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(1.5);
  });

  it('adds 1.0 bonus for task due within 48h', () => {
    const soon = new Date(Date.now() + 30 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low', due_date: soon }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(1.0);
  });

  it('adds 0.3 bonus for task due within 7 days', () => {
    const soon = new Date(Date.now() + 72 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low', due_date: soon }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(0.3);
  });

  it('adds no bonus for task with no due date', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'high' }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(0);
  });

  it('adds no bonus for past due date', () => {
    const past = new Date(Date.now() - 24 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'high', due_date: past }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.urgencyBonus).toBe(0);
  });

  // Mood modifiers
  it('multiplies by 0.85 for great mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: { mood: 'great' },
    });
    expect(r.moodModifier).toBe(0.85);
    expect(r.score).toBe(0.8); // 1.0 * 0.85 → toFixed(1) = 0.8
  });

  it('multiplies by 1.0 for okay mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.moodModifier).toBe(1.0);
  });

  it('multiplies by 1.2 for stressed mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: { mood: 'stressed' },
    });
    expect(r.moodModifier).toBe(1.2);
  });

  it('multiplies by 1.5 for overwhelmed mood', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: { mood: 'overwhelmed' },
    });
    expect(r.moodModifier).toBe(1.5);
  });

  it('multiplies by 1.1 when no checkin available', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'low' }]),
      lastCheckin: null,
    });
    expect(r.moodModifier).toBe(1.1);
  });

  // In-progress weight
  it('applies 0.8 weight for in_progress tasks', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'medium', status: 'in_progress' }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.taskLoad).toBe(1.6); // 2.0 * 0.8
  });

  it('applies 1.0 weight for pending tasks', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'medium', status: 'pending' }]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.taskLoad).toBe(2.0);
  });

  // Thresholds
  it('maps score < 5.0 to low', () => {
    expect(getLoadLevel(0)).toBe('low');
    expect(getLoadLevel(4.9)).toBe('low');
  });

  it('maps score 5.0-9.9 to moderate', () => {
    expect(getLoadLevel(5.0)).toBe('moderate');
    expect(getLoadLevel(9.9)).toBe('moderate');
  });

  it('maps score 10.0-17.9 to high', () => {
    expect(getLoadLevel(10.0)).toBe('high');
    expect(getLoadLevel(17.9)).toBe('high');
  });

  it('maps score >= 18.0 to critical', () => {
    expect(getLoadLevel(18.0)).toBe('critical');
    expect(getLoadLevel(50.0)).toBe('critical');
  });

  // Edge cases
  it('handles empty task array', () => {
    const r = calculateLoad({ tasks: [], lastCheckin: { mood: 'okay' } });
    expect(r.score).toBe(0);
    expect(r.level).toBe('low');
    expect(r.taskLoad).toBe(0);
  });

  it('handles null checkin', () => {
    const r = calculateLoad({
      tasks: mkTasks([{ difficulty: 'medium' }]),
      lastCheckin: null,
    });
    expect(r.moodModifier).toBe(1.1);
    expect(r.score).toBe(2.2); // 2.0 * 1.1
  });

  it('ignores completed tasks', () => {
    const r = calculateLoad({
      tasks: [
        { difficulty: 'high', status: 'completed', due_date: null },
        { difficulty: 'low', status: 'pending', due_date: null },
      ],
      lastCheckin: { mood: 'okay' },
    });
    expect(r.taskLoad).toBe(1.0); // only low pending
    expect(r.highDifficultyCount).toBe(0);
  });

  it('ignores cancelled tasks', () => {
    const r = calculateLoad({
      tasks: [
        { difficulty: 'high', status: 'cancelled', due_date: null },
        { difficulty: 'low', status: 'pending', due_date: null },
      ],
      lastCheckin: { mood: 'okay' },
    });
    expect(r.taskLoad).toBe(1.0);
  });

  it('counts high difficulty tasks correctly', () => {
    const r = calculateLoad({
      tasks: mkTasks([
        { difficulty: 'high' },
        { difficulty: 'high' },
        { difficulty: 'low' },
        { difficulty: 'medium' },
      ]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.highDifficultyCount).toBe(2);
  });

  it('counts upcoming deadlines correctly', () => {
    const tomorrow = new Date(Date.now() + 12 * 3600000).toISOString();
    const r = calculateLoad({
      tasks: mkTasks([
        { difficulty: 'low', due_date: tomorrow },
        { difficulty: 'low', due_date: tomorrow },
        { difficulty: 'high', due_date: null },
      ]),
      lastCheckin: { mood: 'okay' },
    });
    expect(r.upcomingDeadlinesCount).toBe(2);
  });

  it('is deterministic — same input = same output', () => {
    const input = {
      tasks: mkTasks([
        { difficulty: 'medium', due_date: new Date(Date.now() + 12 * 3600000).toISOString() },
        { difficulty: 'high', status: 'in_progress', due_date: null },
      ]),
      lastCheckin: { mood: 'stressed' },
    };
    const r1 = calculateLoad(input);
    const r2 = calculateLoad(input);
    expect(r1).toEqual(r2);
  });
});

describe('computeTrend', () => {
  it('returns stable when no history', () => {
    expect(computeTrend(5, [])).toBe('stable');
  });

  it('returns worsening when current > 150% of average', () => {
    expect(computeTrend(15, [5, 5, 5])).toBe('worsening');
  });

  it('returns improving when current < 70% of average', () => {
    expect(computeTrend(3, [10, 10, 10])).toBe('improving');
  });

  it('returns stable when within 70-150% range', () => {
    expect(computeTrend(10, [10, 10, 10])).toBe('stable');
    expect(computeTrend(14, [10, 10, 10])).toBe('stable');
  });
});
