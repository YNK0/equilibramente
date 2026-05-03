-- Migration: Database triggers for automatic load analysis
-- Sprint 3 — Integracion
--
-- IMPORTANT: Before running, set your secrets via Supabase SQL Editor:
--
--   CREATE OR REPLACE FUNCTION trigger_load_analysis()
--   RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
--   AS $$
--   DECLARE
--     target_user_id uuid;
--     edge_function_url text := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/analyze-load';
--     service_role_jwt text := 'YOUR_SERVICE_ROLE_JWT';
--   BEGIN
--     ...
--   END;
--   $$;
--
-- Then run:
--   SELECT cron.schedule('process-analysis-queue', '*/5 * * * *', '...');

-- Trigger function: call analyze-load Edge Function
-- NOTE: This is a TEMPLATE. Deploy via Supabase Dashboard with actual secrets.
CREATE OR REPLACE FUNCTION trigger_load_analysis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
  edge_function_url text := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/analyze-load';
  service_role_jwt text := '<YOUR_SERVICE_ROLE_JWT>';
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.user_id;
  ELSE
    target_user_id := NEW.user_id;
  END IF;

  PERFORM
    net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', CONCAT('Bearer ', service_role_jwt)
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
