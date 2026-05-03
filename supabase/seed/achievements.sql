-- Seed: achievement catalog
-- Sprint 5 — Modulo 8: Logros y Motivacion

INSERT INTO achievements (key, title, description, icon, category, tier, requirement) VALUES
-- Streaks
('streak_3', '3 dias seguidos', 'Check-in emocional por 3 dias', '🔥', 'streak', 1, '{"type": "checkin", "days": 3}'),
('streak_7', 'Semana completa', 'Check-in emocional por 7 dias', '⭐', 'streak', 2, '{"type": "checkin", "days": 7}'),
('streak_30', 'Mes de racha', 'Check-in emocional por 30 dias', '💎', 'streak', 3, '{"type": "checkin", "days": 30}'),

-- Tasks
('first_task', 'Primera tarea', 'Registrar tu primera tarea', '📝', 'tasks', 1, '{"type": "count", "metric": "tasks_created", "count": 1}'),
('task_master_10', 'Productivo', 'Completar 10 tareas', '✅', 'tasks', 1, '{"type": "count", "metric": "tasks_completed", "count": 10}'),
('task_master_50', 'Imparable', 'Completar 50 tareas', '🏆', 'tasks', 3, '{"type": "count", "metric": "tasks_completed", "count": 50}'),

-- Regulation
('first_breath', 'Primer respiro', 'Completar ejercicio de respiracion', '🫁', 'regulation', 1, '{"type": "count", "metric": "regulation_sessions", "count": 1}'),
('zen_master', 'Zen master', '10 sesiones de regulacion', '🧘', 'regulation', 2, '{"type": "count", "metric": "regulation_sessions", "count": 10}'),

-- Reflection
('first_reflection', 'Primera reflexion', 'Completar reflexion diaria', '💭', 'reflection', 1, '{"type": "count", "metric": "reflections", "count": 1}'),
('deep_thinker', 'Pensador profundo', '7 reflexiones completadas', '🧠', 'reflection', 2, '{"type": "count", "metric": "reflections", "count": 7}'),

-- Emotional / Special
('survivor', 'Sobreviviente', 'Superar un dia con carga critica', '🦾', 'emotional', 2, '{"type": "event", "metric": "survived_critical"}'),
('mood_tracker', 'Conocete', 'Registrar todos los moods posibles', '🎭', 'emotional', 2, '{"type": "all_moods"}'),

-- Daily engagement
('daily_user_7', 'Habito en formacion', 'Usar la app 7 dias diferentes', '📅', 'engagement', 1, '{"type": "days_active", "days": 7}'),
('daily_user_21', 'Habito consolidado', 'Usar la app 21 dias diferentes', '🎯', 'engagement', 2, '{"type": "days_active", "days": 21}'),
('daily_user_60', 'Estilo de vida', 'Usar la app 60 dias diferentes', '🌟', 'engagement', 3, '{"type": "days_active", "days": 60}')
ON CONFLICT DO NOTHING;
