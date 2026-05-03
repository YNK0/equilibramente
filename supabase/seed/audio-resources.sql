-- Seed: audio relaxation resources
-- Sprint 4 — Modulo 5: Regulacion Emocional

INSERT INTO audio_resources (title, description, category, duration_seconds, storage_path, is_active) VALUES
('Respiracion guiada 5 min', 'Ejercicio de respiracion consciente. Ideal para empezar.', 'breathing', 300, 'audio/breathing-guided-5min.mp3', true),
('Escaneo corporal', 'Recorrido guiado por el cuerpo para soltar tension.', 'meditation', 600, 'audio/body-scan-10min.mp3', true),
('Sonidos de naturaleza', 'Lluvia suave y aves para concentracion o descanso.', 'ambient', 900, 'audio/nature-sounds-15min.mp3', true),
('Musica para enfoque', 'Instrumental suave disenado para estudiar.', 'focus', 1200, 'audio/focus-music-20min.mp3', true),
('Relajacion muscular progresiva', 'Tension y relajacion sistematica de grupos musculares.', 'meditation', 480, 'audio/progressive-relaxation-8min.mp3', true)
ON CONFLICT DO NOTHING;
