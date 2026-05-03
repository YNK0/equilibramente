-- Fix: match actual seed data requirement format in check_achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID) RETURNS SETOF UUID AS $$
DECLARE
  ach RECORD;
  user_count INT;
  unlocked_ids UUID[] := '{}';
  tbl TEXT;
  status_filter TEXT;
  streak_metric TEXT;
  mood_list TEXT[];
  type_list TEXT[];
BEGIN
  FOR ach IN SELECT * FROM achievements LOOP

    -- Count-based achievements
    IF ach.requirement->>'type' = 'count' THEN
      tbl := ach.requirement->>'table';
      status_filter := ach.requirement->>'status';

      IF status_filter IS NOT NULL THEN
        EXECUTE format('SELECT COUNT(*) FROM %I WHERE user_id = $1 AND status = $2', tbl)
        INTO user_count USING p_user_id, status_filter;
      ELSE
        EXECUTE format('SELECT COUNT(*) FROM %I WHERE user_id = $1', tbl)
        INTO user_count USING p_user_id;
      END IF;

      IF user_count >= (ach.requirement->>'count')::INT THEN
        INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, ach.id, NOW())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
          unlocked_ids := array_append(unlocked_ids, ach.id);
        END IF;
      END IF;
    END IF;

    -- Streak-based achievements
    IF ach.requirement->>'type' = 'streak' THEN
      streak_metric := ach.requirement->>'metric';

      CASE streak_metric
        WHEN 'checkin_streak' THEN
          SELECT current_count INTO user_count FROM streaks
          WHERE user_id = p_user_id AND type = 'checkin';
        WHEN 'task_completion_streak' THEN
          SELECT current_count INTO user_count FROM streaks
          WHERE user_id = p_user_id AND type = 'task_completion';
        ELSE
          user_count := 0;
      END CASE;

      IF user_count >= (ach.requirement->>'days')::INT THEN
        INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, ach.id, NOW())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
          unlocked_ids := array_append(unlocked_ids, ach.id);
        END IF;
      END IF;
    END IF;

    -- All moods achievement
    IF ach.requirement->>'type' = 'all_moods' THEN
      mood_list := ARRAY(SELECT jsonb_array_elements_text(ach.requirement->'moods'));
      SELECT COUNT(DISTINCT mood) INTO user_count
      FROM emotional_checkins
      WHERE user_id = p_user_id AND mood = ANY(mood_list);

      IF user_count >= array_length(mood_list, 1) THEN
        INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, ach.id, NOW())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
          unlocked_ids := array_append(unlocked_ids, ach.id);
        END IF;
      END IF;
    END IF;

    -- All regulation types achievement
    IF ach.requirement->>'type' = 'all_types' THEN
      type_list := ARRAY(SELECT jsonb_array_elements_text(ach.requirement->'types'));
      SELECT COUNT(DISTINCT type) INTO user_count
      FROM regulation_sessions
      WHERE user_id = p_user_id AND type = ANY(type_list);

      IF user_count >= array_length(type_list, 1) THEN
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
