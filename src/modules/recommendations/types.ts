import type { Database } from '@/types/database';
import type { LoadLevel } from '@/modules/analysis/types';

export type Recommendation = Database['public']['Tables']['recommendations']['Row'];
export type RecommendationLog = Database['public']['Tables']['recommendation_logs']['Row'];
export type RecommendationCategory = 'task_management' | 'pause' | 'emotional' | 'focus';

export interface RecommendationWithAction extends Recommendation {
  action_route: string;
  action_label: string;
}

export interface RecommendationStatus {
  recommendation: Recommendation;
  shown: boolean;
  actioned: boolean;
  was_helpful: boolean | null;
  dismissed: boolean;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  load_level: LoadLevel | null;
  generated_at: string;
}
