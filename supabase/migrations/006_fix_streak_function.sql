-- Fix: handle NULL last_activity_date in update_streak
CREATE OR REPLACE FUNCTION update_streak(
  p_user_id UUID,
  p_type TEXT,
  p_activity_date DATE
) RETURNS void AS $$
DECLARE
  v_streak RECORD;
BEGIN
  SELECT * INTO v_streak
  FROM streaks
  WHERE user_id = p_user_id AND type = p_type;

  IF NOT FOUND THEN
    INSERT INTO streaks (user_id, type, current_count, longest_count, last_activity_date)
    VALUES (p_user_id, p_type, 1, 1, p_activity_date);
  ELSIF v_streak.last_activity_date IS NULL THEN
    -- First activity for existing streak row
    UPDATE streaks
    SET current_count = 1,
        longest_count = 1,
        last_activity_date = p_activity_date,
        updated_at = NOW()
    WHERE id = v_streak.id;
  ELSIF v_streak.last_activity_date = p_activity_date THEN
    -- Already recorded today, nothing to do
    NULL;
  ELSIF v_streak.last_activity_date = p_activity_date - 1 THEN
    UPDATE streaks
    SET current_count = current_count + 1,
        longest_count = GREATEST(longest_count, current_count + 1),
        last_activity_date = p_activity_date,
        updated_at = NOW()
    WHERE id = v_streak.id;
  ELSE
    -- Streak broken (gap > 1 day)
    UPDATE streaks
    SET current_count = 1,
        last_activity_date = p_activity_date,
        updated_at = NOW()
    WHERE id = v_streak.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
