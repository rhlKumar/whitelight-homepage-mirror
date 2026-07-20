-- Drop unused tables that have been replaced by health_insights

-- Drop action_plans table (has FK to health_analyses)
DROP TABLE IF EXISTS public.action_plans CASCADE;

-- Drop health_analyses table (replaced by health_insights)
DROP TABLE IF EXISTS public.health_analyses CASCADE;

-- Drop analysis_jobs table (no longer used)
DROP TABLE IF EXISTS public.analysis_jobs CASCADE;