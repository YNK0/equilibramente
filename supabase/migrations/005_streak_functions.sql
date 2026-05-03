-- Migration: streak maintenance and achievement check functions
-- Updates streaks immediately on user activity instead of waiting for nightly cron

-- Update streak for any activity type
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
  ELSIF v_streak.last_activity_date = p_activity_date - 1 THEN
    UPDATE streaks
    SET current_count = current_count + 1,
        longest_count = GREATEST(longest_count, current_count + 1),
        last_activity_date = p_activity_date,
        updated_at = NOW()
    WHERE id = v_streak.id;
  ELSIF v_streak.last_activity_date < p_activity_date - 1 THEN
    UPDATE streaks
    SET current_count = 1,
        last_activity_date = p_activity_date,
        updated_at = NOW()
    WHERE id = v_streak.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check and unlock achievements for a user
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID) RETURNS SETOF UUID AS $$
DECLARE
  ach RECORD;
  user_count INT;
  unlocked_ids UUID[] := '{}';
BEGIN
  FOR ach IN SELECT * FROM achievements LOOP
    user_count := 0;

    IF ach.requirement->>'type' = 'count' THEN
      CASE ach.requirement->>'metric'
        WHEN 'tasks_created' THEN
          SELECT COUNT(*) INTO user_count FROM tasks WHERE user_id = p_user_id;
        WHEN 'tasks_completed' THEN
          SELECT COUNT(*) INTO user_count FROM tasks WHERE user_id = p_user_id AND status = 'completed';
        WHEN 'regulation_sessions' THEN
          SELECT COUNT(*) INTO user_count FROM regulation_sessions WHERE user_id = p_user_id;
        WHEN 'reflections' THEN
          SELECT COUNT(*) INTO user_count FROM reflections WHERE user_id = p_user_id;
        ELSE
          user_count := 0;
      END CASE;

      IF user_count >= (ach.requirement->>'count')::INT THEN
        INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, ach.id, NOW())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
          unlocked_ids := array_append(unlocked_ids, ach.id);
        END IF;
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT unnest(unlocked_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
