-- Create table for storing health analysis results
CREATE TABLE IF NOT EXISTS public.health_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  report_ids uuid[] NOT NULL,
  questionnaire_id uuid REFERENCES public.questionnaire_responses(id),
  analysis_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own insights"
  ON public.health_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON public.health_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create table for chat messages
CREATE TABLE IF NOT EXISTS public.health_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own messages"
  ON public.health_chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.health_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);