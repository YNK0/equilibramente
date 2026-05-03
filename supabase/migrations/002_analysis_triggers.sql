-- Migration: Database triggers for automatic load analysis
-- Sprint 3 — Integracion: cada vez que cambian tareas o check-in, recalcular carga

-- Trigger function: call analyze-load Edge Function
CREATE OR REPLACE FUNCTION trigger_load_analysis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Determine the user_id from the affected row
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.user_id;
  ELSE
    target_user_id := NEW.user_id;
  END IF;

  -- Call the Edge Function asynchronously via pg_net
  -- Requires pg_net extension to be enabled
  PERFORM
    net.http_post(
      url := CONCAT(current_setting('app.edge_function_url'), '/analyze-load'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', CONCAT('Bearer ', current_setting('app.service_role_key'))
      ),
      body := jsonb_build_object('user_id', target_user_id),
      timeout_milliseconds := 5000
    );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger on tasks: INSERT, UPDATE, DELETE
DROP TRIGGER IF EXISTS tr_tasks_analysis ON tasks;
CREATE TRIGGER tr_tasks_analysis
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_load_analysis();

-- Trigger on emotional_checkins: INSERT, UPDATE
DROP TRIGGER IF EXISTS tr_checkins_analysis ON emotional_checkins;
CREATE TRIGGER tr_checkins_analysis
  AFTER INSERT OR UPDATE ON emotional_checkins
  FOR EACH ROW
  EXECUTE FUNCTION trigger_load_analysis();
