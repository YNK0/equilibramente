-- Migration: add UPDATE RLS policy for emotional_checkins
-- Fixes 406 error when updating existing check-in for today

CREATE POLICY "Users can update own checkins"
ON emotional_checkins
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
