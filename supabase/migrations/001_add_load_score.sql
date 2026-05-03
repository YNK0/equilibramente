-- Migration: add load_score column to load_analyses
-- Sprint 3 — Core Flow II: stores computed load score for charting and history

ALTER TABLE load_analyses
ADD COLUMN IF NOT EXISTS load_score numeric(5,1);

COMMENT ON COLUMN load_analyses.load_score IS 'Computed LOAD_SCORE from the analysis algorithm. Range typically 0-50+.';
