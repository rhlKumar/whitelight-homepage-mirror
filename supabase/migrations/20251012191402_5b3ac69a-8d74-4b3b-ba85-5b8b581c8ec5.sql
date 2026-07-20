-- Add UPDATE policy for users to update their own reports
CREATE POLICY "Users can update own reports"
ON public.reports
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for service role to update any report
CREATE POLICY "Service role can update reports"
ON public.reports
FOR UPDATE
USING (true);