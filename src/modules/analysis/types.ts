import type { Database } from '@/types/database';

export type LoadLevel = 'low' | 'moderate' | 'high' | 'critical';
export type LoadTrend = 'improving' | 'stable' | 'worsening';

export type LoadAnalysis = Database['public']['Tables']['load_analyses']['Row'];

export interface LoadInput {
  tasks: { difficulty: 'low' | 'medium' | 'high'; status: string; due_date: string | null }[];
  lastCheckin: { mood: string } | null;
}

export interface LoadResult {
  score: number;
  level: LoadLevel;
  taskLoad: number;
  urgencyBonus: number;
  moodModifier: number;
  highDifficultyCount: number;
  upcomingDeadlinesCount: number;
}

export interface LoadLevelConfig {
  level: LoadLevel;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  min: number;
  max: number;
}

export interface AnalysisCurrent {
  current: LoadAnalysis | null;
  recommendations: AnalysisRecommendation[] | null;
  message?: string;
}

export interface AnalysisRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: number;
}
