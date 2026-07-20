-- Add new columns for fill-in-the-blanks questionnaire format
ALTER TABLE questionnaire_responses 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS diet_type TEXT,
ADD COLUMN IF NOT EXISTS alcohol_glasses_per_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cigarettes_per_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exercise_times_per_week INTEGER,
ADD COLUMN IF NOT EXISTS sleep_hours NUMERIC,
ADD COLUMN IF NOT EXISTS sleep_time_range TEXT,
ADD COLUMN IF NOT EXISTS symptoms TEXT,
ADD COLUMN IF NOT EXISTS current_medications TEXT,
ADD COLUMN IF NOT EXISTS stress_level TEXT,
ADD COLUMN IF NOT EXISTS water_intake_glasses INTEGER;