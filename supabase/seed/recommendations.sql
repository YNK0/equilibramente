-- Seed: catalog of recommendations with trigger conditions
-- Sprint 3 — Modulo 4: Recomendaciones Inmediatas

INSERT INTO recommendations (category, title, description, priority, trigger_condition, is_active) VALUES
-- Task Management
('task_management', 'Divide y venceras', 'Toma tu tarea mas dificil y dividela en 3 pasos mas pequenos. Haz solo el primero.', 5, '{"load_level": ["high", "critical"], "min_difficulty_tasks": 1}', true),
('task_management', 'Una cosa a la vez', 'Elige la tarea mas urgente. Enfocate solo en esa. Las demas pueden esperar 20 minutos.', 4, '{"load_level": ["high", "critical"]}', true),
('task_management', 'Prioriza por fecha', 'Ordena tus tareas por fecha de entrega. Haz primero lo que vence antes.', 3, '{"load_level": ["moderate", "high"]}', true),
('task_management', 'Elimina lo innecesario', 'De tu lista, hay algo que puedas delegar, posponer o eliminar?', 3, '{"load_level": ["high", "critical"]}', true),

-- Pause
('pause', 'Pausa de 5 minutos', 'Alejate de la pantalla. Estira las piernas. Toma agua. Regresa con mas claridad.', 3, '{"load_level": ["moderate", "high"]}', true),
('pause', 'Micro-meditacion', 'Cierra los ojos por 1 minuto. Solo observa tu respiracion. Nada mas.', 4, '{"mood_in": ["stressed", "overwhelmed"]}', true),
('pause', 'Cambia de entorno', 'Muevete a otro lugar por 5 minutos. Un cambio fisico ayuda a resetear la mente.', 3, '{"mood_in": ["stressed", "overwhelmed"], "time_of_day": ["afternoon"]}', true),

-- Emotional
('emotional', 'Respiracion 4-7-8', 'Inhala 4 segundos, mantiene 7, exhala 8. Repite 4 veces. Reduce ansiedad en 2 minutos.', 5, '{"mood_in": ["stressed", "overwhelmed"]}', true),
('emotional', 'Reencuadre positivo', 'Escribe 1 cosa buena que paso hoy. Por pequena que sea. Esto cambia el foco.', 3, '{"mood_in": ["stressed", "overwhelmed"]}', true),

-- Focus
('focus', 'Tecnica Pomodoro', '25 minutos de enfoque total. 5 de descanso. Repite. Ideal para empezar tareas grandes.', 2, '{"load_level": ["low", "moderate"], "min_difficulty_tasks": 1}', true),
('focus', 'La regla de los 2 minutos', 'Si algo toma menos de 2 minutos, hazlo ahora. Sacarlo del camino libera espacio mental.', 2, '{"load_level": ["moderate"]}', true)
ON CONFLICT DO NOTHING;
