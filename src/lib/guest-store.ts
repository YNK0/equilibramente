'use client';

import type {
  Difficulty,
  EmotionalCheckin,
  LoadLevel,
  MoodLevel,
  Profile,
  Recommendation,
  Streak,
  Task,
  TaskStatus,
} from '@/types/database';
import type { CheckinCreateInput, MoodStats } from '@/modules/emotional/types';
import type { TaskFilters, TaskInsert, TaskStats, TaskUpdate } from '@/modules/tasks/types';
import type { AnalysisCurrent, LoadAnalysis } from '@/modules/analysis/types';
import type { RecommendationsResponse } from '@/modules/recommendations/types';
import type { ReflectionInput } from '@/modules/reflection/types';
import type { AudioResource, RegulationHistory, RegulationSession as RegSession } from '@/modules/regulation/types';
import type { DailyReflection } from '@/modules/reflection/types';
import type { PendingTask, RangeData, TodayData, WeekData } from '@/modules/monitoring/types';
import type { Achievement, AchievementsSummary } from '@/modules/achievements/types';
import type { NotificationPrefs, NotificationPrefsUpdate, ProfileStats, ProfileUpdateInput, PushSubscriptionJSON } from '@/modules/profile/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'equilibramente:guest_data';

function uid(): string {
  return `gst-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function isoNow(): string {
  return new Date().toISOString();
}

// ---- Static seed data ----------------------------------------------------

interface SeedAchievement { id: string; key: string; title: string; description: string; icon: string; category: string; tier: number; requirement: Record<string, unknown>; }

const SEED_ACHIEVEMENTS: SeedAchievement[] = [
  {
    id: 'ach-1',
    key: 'first_checkin',
    title: 'Primer check-in',
    description: 'Registraste tu estado emocional por primera vez',
    icon: '🎯',
    category: 'emotional',
    tier: 1,
    requirement: { type: 'checkin_count', count: 1 },
  },
  {
    id: 'ach-2',
    key: 'streak_3',
    title: 'Racha de 3',
    description: '3 dias seguidos de check-in',
    icon: '🔥',
    category: 'streak',
    tier: 1,
    requirement: { type: 'streak', count: 3 },
  },
  {
    id: 'ach-3',
    key: 'streak_7',
    title: 'Racha semanal',
    description: '7 dias seguidos de check-in',
    icon: '⭐',
    category: 'streak',
    tier: 2,
    requirement: { type: 'streak', count: 7 },
  },
  {
    id: 'ach-4',
    key: 'first_task',
    title: 'Primera tarea',
    description: 'Registraste tu primera tarea',
    icon: '📝',
    category: 'tasks',
    tier: 1,
    requirement: { type: 'task_count', count: 1 },
  },
  {
    id: 'ach-5',
    key: 'complete_5',
    title: 'Productivo',
    description: 'Completaste 5 tareas',
    icon: '✅',
    category: 'tasks',
    tier: 2,
    requirement: { type: 'completed_tasks', count: 5 },
  },
  {
    id: 'ach-6',
    key: 'first_breath',
    title: 'Primer respiro',
    description: 'Completaste tu primer ejercicio de respiracion',
    icon: '🧘',
    category: 'regulation',
    tier: 1,
    requirement: { type: 'regulation_count', count: 1 },
  },
  {
    id: 'ach-7',
    key: 'first_reflection',
    title: 'Primera reflexion',
    description: 'Escribiste tu primera reflexion diaria',
    icon: '💭',
    category: 'reflection',
    tier: 1,
    requirement: { type: 'reflection_count', count: 1 },
  },
  {
    id: 'ach-8',
    key: 'streak_14',
    title: 'Racha de 14',
    description: '14 dias seguidos de check-in',
    icon: '🌟',
    category: 'streak',
    tier: 3,
    requirement: { type: 'streak', count: 14 },
  },
];

const SEED_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    category: 'task_management',
    title: 'Divide tus tareas',
    description: 'Separa las tareas grandes en pasos mas pequenos y manejables. Empieza por el mas facil.',
    trigger_condition: { load_level: 'moderate' },
    priority: 3,
    is_active: true,
  },
  {
    id: 'rec-2',
    category: 'emotional',
    title: 'Respiracion 4-7-8',
    description: 'Inhala por 4 segundos, mantén por 7, exhala por 8. Repite 4 veces para calmar la ansiedad.',
    trigger_condition: { load_level: 'high' },
    priority: 5,
    is_active: true,
  },
  {
    id: 'rec-3',
    category: 'pause',
    title: 'Pausa activa de 5 minutos',
    description: 'Levantate, estira los brazos, camina un poco. Despeja la mente antes de continuar.',
    trigger_condition: { load_level: 'moderate' },
    priority: 3,
    is_active: true,
  },
  {
    id: 'rec-4',
    category: 'focus',
    title: 'Tecnica Pomodoro',
    description: '25 minutos de concentracion total, 5 de descanso. Despues de 4 ciclos, descansa 15 minutos.',
    trigger_condition: { load_level: 'high' },
    priority: 4,
    is_active: true,
  },
  {
    id: 'rec-5',
    category: 'emotional',
    title: 'Busca apoyo',
    description: 'Habla con un companero, amigo o familiar sobre como te sientes. No estas solo en esto.',
    trigger_condition: { load_level: 'critical' },
    priority: 5,
    is_active: true,
  },
  {
    id: 'rec-6',
    category: 'task_management',
    title: 'Prioriza lo urgente',
    description: 'Identifica las 2-3 tareas mas importantes del dia. Enfocate solo en esas.',
    trigger_condition: { load_level: 'high' },
    priority: 4,
    is_active: true,
  },
];

const SEED_AUDIO: AudioResource[] = [
  {
    id: 'audio-1',
    title: '5 minutos magicos para calmar el sistema nervioso',
    description: 'Meditacion guiada corta para reducir el estres',
    duration_seconds: 300,
    category: 'meditacion',
    is_active: true,
    storage_path: 'meditacion-5-min.mp3',
    thumbnail_url: null,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'audio-2',
    title: 'Meditacion para principiantes',
    description: 'Ideal si nunca has meditado antes',
    duration_seconds: 360,
    category: 'meditacion',
    is_active: true,
    storage_path: 'meditacion-principiantes.mp3',
    thumbnail_url: null,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'audio-3',
    title: 'Musica relajante - Naturaleza',
    description: 'Sonidos de naturaleza para estudiar o descansar',
    duration_seconds: 600,
    category: 'musica',
    is_active: true,
    storage_path: 'musica-naturaleza.mp3',
    thumbnail_url: null,
    created_at: '2025-01-01T00:00:00Z',
  },
];

// ---- Stored data shape ---------------------------------------------------

interface GuestData {
  checkins: EmotionalCheckin[];
  tasks: Task[];
  analyses: LoadAnalysis[];
  reflections: DailyReflection[];
  regulationSessions: RegSession[];
  streaks: Streak[];
  userAchievements: { achievement_id: string; unlocked_at: string }[];
  recommendationLogs: {
    recommendation_id: string;
    load_analysis_id: string;
    action_taken: string | null;
    was_helpful: boolean | null;
  }[];
  profile: Profile;
  notificationPrefs: NotificationPrefs;
}

// ---- Query helpers -------------------------------------------------------

function eq<T>(items: T[], field: keyof T, value: unknown): T[] {
  return items.filter((i) => i[field] === value);
}

function neq<T>(items: T[], field: keyof T, value: unknown): T[] {
  return items.filter((i) => i[field] !== value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gte<T extends Record<string, any>>(items: T[], field: string, value: string): T[] {
  return items.filter((i) => String(i[field] ?? '') >= value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lte<T extends Record<string, any>>(items: T[], field: string, value: string): T[] {
  return items.filter((i) => String(i[field] ?? '') <= value);
}

function orderBy<T>(items: T[], field: keyof T, asc: boolean): T[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (va == null && vb == null) return 0;
    if (va == null) return asc ? 1 : -1;
    if (vb == null) return asc ? -1 : 1;
    if (va < vb) return asc ? -1 : 1;
    if (va > vb) return asc ? 1 : -1;
    return 0;
  });
  return sorted;
}

function range<T>(items: T[], from: number, to: number): T[] {
  return items.slice(from, to + 1);
}

// ---------------------------------------------------------------------------
// GuestStore
// ---------------------------------------------------------------------------

class GuestStore {
  private data: GuestData;

  constructor() {
    this.data = this.load();
  }

  // ---- Persistence -------------------------------------------------------

  private load(): GuestData {
    if (typeof window === 'undefined') return this.empty();
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as GuestData;
    } catch { /* corrupted, reset */ }
    return this.empty();
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch { /* quota exceeded */ }
  }

  private empty(): GuestData {
    return {
      checkins: [],
      tasks: [],
      analyses: [],
      reflections: [],
      regulationSessions: [],
      streaks: [
        { id: uid(), user_id: 'guest', type: 'checkin', current_count: 0, longest_count: 0, last_activity_date: null },
        { id: uid(), user_id: 'guest', type: 'task_completion', current_count: 0, longest_count: 0, last_activity_date: null },
        { id: uid(), user_id: 'guest', type: 'reflection', current_count: 0, longest_count: 0, last_activity_date: null },
        { id: uid(), user_id: 'guest', type: 'regulation', current_count: 0, longest_count: 0, last_activity_date: null },
      ],
      userAchievements: [],
      recommendationLogs: [],
      profile: {
        id: 'guest',
        display_name: 'Invitado',
        avatar_url: null,
        onboarding_completed: false,
        streak_hour: '20:00',
        created_at: isoNow(),
        updated_at: isoNow(),
      },
      notificationPrefs: {
        id: 'guest-prefs',
        user_id: 'guest',
        push_subscription: null,
        checkin_reminder: true,
        task_reminder: true,
        stress_alert: true,
        achievement_notify: true,
        quiet_hours_start: null,
        quiet_hours_end: null,
        created_at: isoNow(),
        updated_at: isoNow(),
      },
    };
  }

  // ---- Streak helpers ----------------------------------------------------

  private updateStreak(type: Streak['type'], activityDate: string): void {
    const streak = this.data.streaks.find((s) => s.type === type);
    if (!streak) return;
    const lastDate = streak.last_activity_date;
    if (lastDate === activityDate) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday || lastDate === null) {
      streak.current_count += 1;
    } else if (lastDate !== activityDate) {
      streak.current_count = 1;
    }
    streak.last_activity_date = activityDate;
    if (streak.current_count > streak.longest_count) {
      streak.longest_count = streak.current_count;
    }
    this.save();
  }

  private checkAchievements(): void {
    const unlocked = new Set(this.data.userAchievements.map((a) => a.achievement_id));
    const checkinCount = this.data.checkins.length;
    const taskCount = this.data.tasks.length;
    const completedTasks = this.data.tasks.filter((t) => t.status === 'completed').length;
    const regCount = this.data.regulationSessions.length;
    const reflectionCount = this.data.reflections.length;
    const checkinStreak = this.data.streaks.find((s) => s.type === 'checkin')?.current_count ?? 0;
    let changed = false;

    for (const ach of SEED_ACHIEVEMENTS) {
      if (unlocked.has(ach.id)) continue;
      let earned = false;
      const req = ach.requirement as { type: string; count: number };
      if (req.type === 'checkin_count') earned = checkinCount >= req.count;
      else if (req.type === 'task_count') earned = taskCount >= req.count;
      else if (req.type === 'completed_tasks') earned = completedTasks >= req.count;
      else if (req.type === 'regulation_count') earned = regCount >= req.count;
      else if (req.type === 'reflection_count') earned = reflectionCount >= req.count;
      else if (req.type === 'streak') earned = checkinStreak >= req.count;
      if (earned) {
        this.data.userAchievements.push({ achievement_id: ach.id, unlocked_at: isoNow() });
        changed = true;
      }
    }
    if (changed) this.save();
  }

  // ---- Emotional checkins ------------------------------------------------

  createOrUpdateCheckin(input: CheckinCreateInput): EmotionalCheckin {
    const date = today();
    const existing = this.data.checkins.find((c) => c.created_at >= date);
    if (existing) {
      existing.mood = input.mood;
      existing.intensity = input.intensity ?? null;
      existing.note = input.note?.trim() || null;
      this.save();
      return { ...existing };
    }
    const checkin: EmotionalCheckin = {
      id: uid(), user_id: 'guest', mood: input.mood,
      intensity: input.intensity ?? null, note: input.note?.trim() || null, created_at: isoNow(),
    };
    this.data.checkins.push(checkin);
    this.updateStreak('checkin', date);
    this.checkAchievements();
    this.save();
    return { ...checkin };
  }

  getTodayCheckin(): EmotionalCheckin | null {
    const date = today();
    const found = orderBy(eq(this.data.checkins, 'user_id', 'guest'), 'created_at', false).find(
      (c) => c.created_at >= date
    );
    return found ? { ...found } : null;
  }

  listCheckins(limit = 30, offset = 0, from?: string, to?: string): { data: EmotionalCheckin[]; count: number } {
    let items = eq(this.data.checkins, 'user_id', 'guest');
    if (from) items = gte(items, 'created_at', from);
    if (to) items = lte(items, 'created_at', to);
    items = orderBy(items, 'created_at', false);
    const count = items.length;
    return { data: range(items, offset, offset + limit - 1).map((c) => ({ ...c })), count };
  }

  getCheckinStats(days: number): MoodStats {
    const to = today();
    const from = new Date(Date.now() - (days - 1) * 86400000).toISOString().split('T')[0];
    let items = eq(this.data.checkins, 'user_id', 'guest');
    items = gte(items, 'created_at', from);
    items = lte(items, 'created_at', `${to}T23:59:59`);
    items = orderBy(items, 'created_at', false);

    const distribution: Record<MoodLevel, number> = { great: 0, okay: 0, stressed: 0, overwhelmed: 0 };
    let totalIntensity = 0;
    for (const c of items) {
      distribution[c.mood as MoodLevel]++;
      if (c.intensity) totalIntensity += c.intensity;
    }

    let trend: MoodStats['mood_trend'] = 'stable';
    if (items.length >= 3) {
      const half = Math.ceil(items.length / 2);
      const recent = items.slice(0, half);
      const older = items.slice(half);
      const recentPos = recent.filter((m) => ['great', 'okay'].includes(m.mood)).length;
      const olderPos = older.filter((m) => ['great', 'okay'].includes(m.mood)).length;
      if (recentPos > olderPos) trend = 'improving';
      else if (recentPos < olderPos) trend = 'declining';
    }

    const entries = Object.entries(distribution) as [MoodLevel, number][];
    const max = Math.max(...entries.map(([, v]) => v));
    const mostFrequent = max === 0 ? null : entries.find(([, v]) => v === max)?.[0] ?? null;

    return {
      period: { from, to },
      total_checkins: items.length,
      mood_distribution: distribution,
      current_streak: this.data.streaks.find((s) => s.type === 'checkin')?.current_count ?? 0,
      avg_intensity: items.length > 0 ? totalIntensity / items.length : 0,
      most_frequent_mood: mostFrequent,
      mood_trend: trend,
    };
  }

  // ---- Tasks -------------------------------------------------------------

  listTasks(filters: TaskFilters, limit = 20, offset = 0): { data: Task[]; count: number } {
    let items = eq(this.data.tasks, 'user_id', 'guest');
    items = eq(items, 'status', filters.status);
    if (filters.difficulty) items = eq(items, 'difficulty', filters.difficulty);
    items = orderBy(items, 'due_date', true);
    items = orderBy(items, 'created_at', false);
    const count = items.length;
    return { data: range(items, offset, offset + limit - 1).map((t) => ({ ...t })), count };
  }

  createTask(input: TaskInsert): Task {
    const task: Task = {
      id: uid(), user_id: 'guest', title: input.title,
      description: input.description ?? null,
      difficulty: (input.difficulty as Difficulty) || 'medium',
      due_date: input.due_date ?? null,
      estimated_minutes: input.estimated_minutes ?? null,
      status: (input.status as TaskStatus) || 'pending',
      completed_at: null, created_at: isoNow(), updated_at: isoNow(),
    };
    this.data.tasks.push(task);
    this.checkAchievements();
    this.save();
    return { ...task };
  }

  getTaskById(id: string): Task {
    const task = this.data.tasks.find((t) => t.id === id && t.user_id === 'guest');
    if (!task) throw new Error('Task not found');
    return { ...task };
  }

  updateTask(id: string, input: TaskUpdate): Task {
    const task = this.data.tasks.find((t) => t.id === id && t.user_id === 'guest');
    if (!task) throw new Error('Task not found');
    Object.assign(task, input, { updated_at: isoNow() });
    this.save();
    return { ...task };
  }

  completeTask(id: string): Task {
    const task = this.data.tasks.find((t) => t.id === id && t.user_id === 'guest');
    if (!task) throw new Error('Task not found');
    task.status = 'completed';
    task.completed_at = isoNow();
    task.updated_at = isoNow();
    this.updateStreak('task_completion', today());
    this.checkAchievements();
    this.save();
    return { ...task };
  }

  removeTask(id: string): void {
    const idx = this.data.tasks.findIndex((t) => t.id === id && t.user_id === 'guest');
    if (idx !== -1) { this.data.tasks.splice(idx, 1); this.save(); }
  }

  getTaskStats(): TaskStats {
    const tasks = eq(this.data.tasks, 'user_id', 'guest');
    const pending = tasks.filter((t) => t.status === 'pending');
    const completed = tasks.filter((t) => t.status === 'completed');
    const completedToday = completed.filter((t) => t.completed_at?.startsWith(today())).length;
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const completedWeek = completed.filter((t) => t.completed_at && t.completed_at >= weekAgo).length;
    const urgentCount = pending.filter((t) => {
      if (!t.due_date) return false;
      return Math.ceil((new Date(t.due_date).getTime() - Date.now()) / 86400000) <= 1;
    }).length;
    const total = tasks.filter((t) => t.status !== 'cancelled').length;
    const completionRate = total > 0 ? completed.length / total : 0;
    return {
      pending: {
        total: pending.length,
        high: pending.filter((t) => t.difficulty === 'high').length,
        medium: pending.filter((t) => t.difficulty === 'medium').length,
        low: pending.filter((t) => t.difficulty === 'low').length,
      },
      completed_today: completedToday,
      completed_week: completedWeek,
      completion_rate: Math.round(completionRate * 100) / 100,
      urgent_count: urgentCount,
    };
  }

  // ---- Analysis ----------------------------------------------------------

  private computeLoad(): LoadAnalysis {
    const tasks = eq(this.data.tasks, 'user_id', 'guest');
    const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
    const highCount = pending.filter((t) => t.difficulty === 'high').length;
    const upcomingDeadlines = pending.filter((t) => {
      if (!t.due_date) return false;
      return Math.ceil((new Date(t.due_date).getTime() - Date.now()) / 86400000) <= 1;
    }).length;
    const lastCheckin = orderBy(eq(this.data.checkins, 'user_id', 'guest'), 'created_at', false)[0];
    let score = Math.min(pending.length * 10 + highCount * 15 + upcomingDeadlines * 20, 100);
    let level: LoadLevel = 'low';
    if (score >= 71) level = 'critical';
    else if (score >= 46) level = 'high';
    else if (score >= 21) level = 'moderate';
    if (lastCheckin?.mood === 'overwhelmed') {
      score = Math.min(score + 15, 100);
      level = score >= 71 ? 'critical' : score >= 46 ? 'high' : level;
    }
    if (lastCheckin?.mood === 'stressed') {
      score = Math.min(score + 8, 100);
      level = score >= 71 ? 'critical' : score >= 46 ? 'high' : level;
    }
    const levelPriority: Record<LoadLevel, number> = { low: 1, moderate: 3, high: 4, critical: 5 };
    const minPriority = levelPriority[level];
    const recIds = SEED_RECOMMENDATIONS
      .filter((r) => r.priority >= minPriority)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .map((r) => r.id);
    return {
      id: uid(), user_id: 'guest', load_level: level, load_score: score,
      task_count: pending.length, high_difficulty_count: highCount,
      upcoming_deadlines_count: upcomingDeadlines,
      last_mood: lastCheckin?.mood ?? null,
      recommendation_ids: recIds as unknown as string[],
      created_at: isoNow(),
    };
  }

  getCurrentAnalysis(): AnalysisCurrent {
    const analysis = this.computeLoad();
    const last = orderBy(this.data.analyses, 'created_at', false)[0];
    if (!last || last.created_at < today()) {
      this.data.analyses.push(analysis);
      if (this.data.analyses.length > 90) this.data.analyses.shift();
      this.save();
    }
    const recs = SEED_RECOMMENDATIONS
      .filter((r) => analysis.recommendation_ids?.includes(r.id))
      .map((r) => ({ id: r.id, category: r.category, title: r.title, description: r.description, priority: r.priority }));
    return { current: analysis, recommendations: recs };
  }

  getAnalysisHistory(days = 7, from?: string, to?: string): { data: LoadAnalysis[]; count: number } {
    let items = this.data.analyses;
    if (from) items = gte(items, 'created_at', from);
    if (to) items = lte(items, 'created_at', to);
    else {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      items = gte(items, 'created_at', since);
    }
    items = orderBy(items, 'created_at', false);
    return { data: items.map((a) => ({ ...a })), count: items.length };
  }

  // ---- Recommendations ---------------------------------------------------

  getCurrentRecommendations(): RecommendationsResponse {
    const analysis = this.computeLoad();
    const recs = SEED_RECOMMENDATIONS.filter((r) => analysis.recommendation_ids?.includes(r.id));
    return {
      recommendations: recs.map((r) => ({
        id: r.id, category: r.category, title: r.title, description: r.description, priority: r.priority,
        trigger_condition: r.trigger_condition, is_active: r.is_active, created_at: isoNow(),
      })) as unknown as RecommendationsResponse['recommendations'],
      load_level: analysis.load_level as LoadLevel | null,
      generated_at: isoNow(),
    };
  }

  sendRecommendationFeedback(
    recommendationId: string, loadAnalysisId: string,
    actionTaken: string | null, wasHelpful: boolean | null
  ): void {
    this.data.recommendationLogs.push({
      recommendation_id: recommendationId, load_analysis_id: loadAnalysisId,
      action_taken: actionTaken, was_helpful: wasHelpful,
    });
    this.save();
  }

  // ---- Regulation --------------------------------------------------------

  startRegulationSession(type: string, moodBefore?: string | null): RegSession {
    const session: RegSession = {
      id: uid(), user_id: 'guest', type: type as RegSession['type'],
      duration_seconds: 0, resource_id: null,
      mood_before: (moodBefore as MoodLevel) ?? null, mood_after: null,
      load_analysis_id: null, created_at: isoNow(),
    };
    this.data.regulationSessions.push(session);
    this.save();
    return { ...session };
  }

  completeRegulationSession(id: string, durationSeconds: number, moodAfter?: string | null, loadAnalysisId?: string | null): RegSession {
    if (durationSeconds < 30) {
      const idx = this.data.regulationSessions.findIndex((s) => s.id === id && s.user_id === 'guest');
      if (idx !== -1) this.data.regulationSessions.splice(idx, 1);
      this.save();
      throw new Error('Sessions under 30 seconds are not saved');
    }
    const session = this.data.regulationSessions.find((s) => s.id === id && s.user_id === 'guest');
    if (!session) throw new Error('Session not found');
    session.duration_seconds = durationSeconds;
    session.mood_after = (moodAfter as MoodLevel) ?? null;
    session.load_analysis_id = loadAnalysisId ?? null;
    this.checkAchievements();
    this.save();
    return { ...session };
  }

  cancelRegulationSession(id: string): void {
    const idx = this.data.regulationSessions.findIndex((s) => s.id === id && s.user_id === 'guest');
    if (idx !== -1) { this.data.regulationSessions.splice(idx, 1); this.save(); }
  }

  getAudios(): AudioResource[] {
    return SEED_AUDIO;
  }

  getRegulationHistory(days = 30): RegulationHistory {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let sessions = eq(this.data.regulationSessions, 'user_id', 'guest');
    sessions = gte(sessions, 'created_at', since);
    sessions = orderBy(sessions, 'created_at', false);
    let totalSeconds = 0;
    const typeCount: Record<string, number> = {};
    for (const s of sessions) {
      totalSeconds += s.duration_seconds ?? 0;
      typeCount[s.type] = (typeCount[s.type] || 0) + 1;
    }
    let mostUsedType = 'breathing';
    let maxCount = 0;
    for (const [t, c] of Object.entries(typeCount)) {
      if (c > maxCount) { maxCount = c; mostUsedType = t; }
    }
    return {
      data: sessions.map((s) => ({ ...s })),
      count: sessions.length,
      total_seconds: totalSeconds,
      most_used_type: mostUsedType,
    };
  }

  getSignedUrl(_storagePath?: string): string {
    return '';
  }

  // ---- Reflections -------------------------------------------------------

  getTodayReflection(): DailyReflection | null {
    const date = today();
    const found = this.data.reflections.find((r) => r.user_id === 'guest' && r.reflection_date === date);
    return found ? { ...found } : null;
  }

  saveReflection(input: ReflectionInput): DailyReflection {
    const date = today();
    const existing = this.data.reflections.find((r) => r.user_id === 'guest' && r.reflection_date === date);
    if (existing) {
      Object.assign(existing, input);
      this.save();
      return { ...existing };
    }
    const reflection: DailyReflection = {
      id: uid(), user_id: 'guest',
      question_1: input.question_1 ?? null, question_2: input.question_2 ?? null,
      question_3: input.question_3 ?? null, day_rating: input.day_rating ?? null,
      reflection_date: date, created_at: isoNow(),
    };
    this.data.reflections.push(reflection);
    this.updateStreak('reflection', date);
    this.checkAchievements();
    this.save();
    return { ...reflection };
  }

  getReflectionHistory(limit = 30): DailyReflection[] {
    let items = eq(this.data.reflections, 'user_id', 'guest');
    items = orderBy(items, 'reflection_date', false);
    return items.slice(0, limit).map((r) => ({ ...r }));
  }

  // ---- Monitoring --------------------------------------------------------

  getMonitoringToday(): TodayData {
    const date = today();
    const checkin = this.getTodayCheckin();
    const tasks = eq(this.data.tasks, 'user_id', 'guest');
    const lastAnalysis = orderBy(this.data.analyses, 'created_at', false)[0];
    const regToday = gte(eq(this.data.regulationSessions, 'user_id', 'guest'), 'created_at', date);
    const streak = this.data.streaks.find((s) => s.type === 'checkin');
    return {
      date,
      checkin: checkin ? { mood: checkin.mood, intensity: checkin.intensity ?? 0 } : null,
      tasks: {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        pending: tasks.filter((t) => t.status !== 'completed').length,
      },
      load: { level: (lastAnalysis?.load_level as LoadLevel) ?? null, score: lastAnalysis?.load_score ?? null },
      regulation: {
        sessions: regToday.length,
        total_seconds: regToday.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0),
      },
      streak: { type: 'checkin' as const, current: streak?.current_count ?? 0, longest: streak?.longest_count ?? 0 },
    };
  }

  getMonitoringWeek(): WeekData {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const from = monday.toISOString().split('T')[0];
    const to = sunday.toISOString().split('T')[0];
    const checkins = gte(lte(eq(this.data.checkins, 'user_id', 'guest'), 'created_at', `${to}T23:59:59`), 'created_at', from);
    const tasks = eq(this.data.tasks, 'user_id', 'guest');
    const analyses = gte(lte(eq(this.data.analyses, 'user_id', 'guest'), 'created_at', `${to}T23:59:59`), 'created_at', from);

    const checkinMap = new Map<string, string>();
    for (const c of checkins) { const d = c.created_at.split('T')[0]; if (!checkinMap.has(d)) checkinMap.set(d, c.mood); }
    const analysisMap = new Map<string, string>();
    for (const a of analyses) { const d = a.created_at.split('T')[0]; analysisMap.set(d, a.load_level); }

    const days: WeekData['days'] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const tasksCompleted = tasks.filter((t) => t.status === 'completed' && t.completed_at?.startsWith(dateStr)).length;
      days.push({ date: dateStr, mood: (checkinMap.get(dateStr) as MoodLevel) ?? null, tasks_completed: tasksCompleted, load_level: (analysisMap.get(dateStr) as LoadLevel) ?? null, has_checkin: checkinMap.has(dateStr) });
    }

    const moods = days.filter((d) => d.mood).map((d) => d.mood!);
    const moodValues: Record<string, number> = { great: 5, okay: 3.5, stressed: 2, overwhelmed: 1 };
    const avgMood = moods.length > 0 ? moods.reduce((sum, m) => sum + (moodValues[m] || 0), 0) / moods.length : 0;
    const half = Math.ceil(moods.length / 2);
    const firstAvg = half > 0 ? moods.slice(0, half).reduce((s, m) => s + (moodValues[m] || 0), 0) / half : 0;
    const secondAvg = moods.length - half > 0 ? moods.slice(half).reduce((s, m) => s + (moodValues[m] || 0), 0) / (moods.length - half) : 0;
    const trend: 'improving' | 'stable' | 'worsening' =
      moods.length < 2 ? 'stable' : secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'worsening' : 'stable';

    const streakData = { checkin: 0, tasks: 0 };
    for (const s of this.data.streaks) {
      if (s.type in streakData) streakData[s.type as keyof typeof streakData] = s.current_count;
    }

    return {
      week_start: from, week_end: to, days,
      summary: {
        avg_mood: parseFloat(avgMood.toFixed(1)),
        total_tasks_completed: tasks.filter((t) => t.status === 'completed').length,
        total_regulation_minutes: 0,
        streaks: streakData,
        achievements_unlocked: this.data.userAchievements.length,
        trend,
      },
    };
  }

  getPendingTasks(limit = 3): PendingTask[] {
    let items = eq(this.data.tasks, 'user_id', 'guest');
    items = neq(items, 'status', 'completed' as TaskStatus);
    items = orderBy(items, 'due_date', true);
    items = orderBy(items, 'created_at', false);
    return items.slice(0, limit).map((t) => ({ id: t.id, title: t.title, difficulty: t.difficulty, due_date: t.due_date, status: t.status }));
  }

  getMonitoringRange(from: string, to: string): RangeData {
    const checkins = gte(lte(eq(this.data.checkins, 'user_id', 'guest'), 'created_at', `${to}T23:59:59`), 'created_at', from);
    const dayMap = new Map<string, string>();
    for (const c of checkins) { const d = c.created_at.split('T')[0]; if (!dayMap.has(d)) dayMap.set(d, c.mood); }
    const days: RangeData['days'] = [];
    const start = new Date(from);
    const end = new Date(to);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, mood: (dayMap.get(dateStr) as MoodLevel) ?? null, tasks_completed: 0, load_level: null, has_checkin: dayMap.has(dateStr) });
    }
    return { from, to, days };
  }

  // ---- Achievements ------------------------------------------------------

  getAllAchievements(): { achievements: Achievement[]; summary: AchievementsSummary } {
    const unlockedIds = new Set(this.data.userAchievements.map((a) => a.achievement_id));
    const achievements: Achievement[] = SEED_ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
      unlocked_at: this.data.userAchievements.find((u) => u.achievement_id === a.id)?.unlocked_at ?? null,
      progress: null,
    }));
    return { achievements, summary: { unlocked: this.data.userAchievements.length, total: SEED_ACHIEVEMENTS.length } };
  }

  getStreaks(): Streak[] {
    return this.data.streaks.map((s) => ({ ...s }));
  }

  // ---- Profile -----------------------------------------------------------

  getProfile(): Profile {
    return { ...this.data.profile, updated_at: isoNow() };
  }

  updateProfile(input: ProfileUpdateInput): Profile {
    Object.assign(this.data.profile, input, { updated_at: isoNow() });
    this.save();
    return { ...this.data.profile };
  }

  getNotificationPrefs(): NotificationPrefs {
    return { ...this.data.notificationPrefs };
  }

  updateNotificationPrefs(input: NotificationPrefsUpdate): NotificationPrefs {
    Object.assign(this.data.notificationPrefs, input);
    this.save();
    return { ...this.data.notificationPrefs };
  }

  subscribePush(_subscription: PushSubscriptionJSON): void {
    // No-op in guest mode
  }

  unsubscribePush(): void {
    // No-op in guest mode
  }

  getProfileStats(): ProfileStats {
    const tasks = eq(this.data.tasks, 'user_id', 'guest');
    const regSessions = eq(this.data.regulationSessions, 'user_id', 'guest');
    const totalRegMinutes = Math.round(regSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);
    const totalDays = Math.floor((Date.now() - new Date(this.data.profile.created_at).getTime()) / 86400000);
    return {
      total_days: totalDays,
      total_checkins: this.data.checkins.length,
      total_tasks_completed: tasks.filter((t) => t.status === 'completed').length,
      total_regulation_minutes: totalRegMinutes,
      achievements_unlocked: this.data.userAchievements.length,
      achievements_total: SEED_ACHIEVEMENTS.length,
      longest_streak: Math.max(...this.data.streaks.map((s) => s.current_count), 0),
    };
  }

  uploadAvatar(_file: File): Promise<string> {
    return Promise.resolve('');
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _store: GuestStore | null = null;

export function getGuestStore(): GuestStore {
  if (!_store) _store = new GuestStore();
  return _store;
}
