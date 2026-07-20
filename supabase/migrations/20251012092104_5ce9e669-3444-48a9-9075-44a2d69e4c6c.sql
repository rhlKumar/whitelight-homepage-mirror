-- Add change_summary column to health_insights_history
ALTER TABLE public.health_insights_history 
ADD COLUMN change_summary jsonb;