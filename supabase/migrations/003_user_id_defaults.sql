-- Migration: set auth.uid() as default for user_id columns
-- Fixes RLS violation on INSERT when client code doesn't explicitly pass user_id

ALTER TABLE emotional_checkins ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE daily_monitoring ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE load_analyses ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE notification_preferences ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE recommendation_logs ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE reflections ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE regulation_sessions ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE streaks ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE user_achievements ALTER COLUMN user_id SET DEFAULT auth.uid();
