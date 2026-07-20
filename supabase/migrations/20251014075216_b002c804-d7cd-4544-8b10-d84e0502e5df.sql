-- Create analysis_locks table for distributed locking
CREATE TABLE IF NOT EXISTS public.analysis_locks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  locked_at timestamp with time zone NOT NULL DEFAULT now(),
  function_instance_id text,
  created_at timestamp with time zone DEFAULT now()
);

-- Index for stale lock cleanup
CREATE INDEX idx_analysis_locks_locked_at ON public.analysis_locks(locked_at);

-- Enable RLS
ALTER TABLE public.analysis_locks ENABLE ROW LEVEL SECURITY;

-- Service role can manage locks (edge functions only)
CREATE POLICY "Service role can manage locks"
  ON public.analysis_locks
  FOR ALL
  USING (true)
  WITH CHECK (true);