export interface DailyReflection {
  id: string;
  user_id: string;
  question_1: string | null;
  question_2: string | null;
  question_3: string | null;
  day_rating: number | null;
  reflection_date: string;
  created_at: string;
}

export interface ReflectionInput {
  question_1?: string | null;
  question_2?: string | null;
  question_3?: string | null;
  day_rating?: number | null;
}
