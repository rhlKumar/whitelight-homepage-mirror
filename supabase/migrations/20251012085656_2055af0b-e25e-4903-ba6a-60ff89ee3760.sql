-- Phase 1: Add version tracking and history to health_insights

-- Add version tracking columns to health_insights table
ALTER TABLE public.health_insights
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_updated_sections TEXT[];

-- Create health_insights_history table for audit trail
CREATE TABLE IF NOT EXISTS public.health_insights_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_id UUID NOT NULL,
  user_id UUID NOT NULL,
  version INTEGER NOT NULL,
  updated_sections TEXT[],
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on history table
ALTER TABLE public.health_insights_history ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own history
CREATE POLICY "Users can view own insight history"
ON public.health_insights_history
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Users can insert their own history (system will do this)
CREATE POLICY "Users can insert own insight history"
ON public.health_insights_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_health_insights_history_insight_id ON public.health_insights_history(insight_id);
CREATE INDEX IF NOT EXISTS idx_health_insights_history_user_id ON public.health_insights_history(user_id);