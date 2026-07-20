-- Add unique constraint on user_id in questionnaire_responses table
-- This allows upsert operations to work properly
ALTER TABLE public.questionnaire_responses 
ADD CONSTRAINT questionnaire_responses_user_id_key UNIQUE (user_id);