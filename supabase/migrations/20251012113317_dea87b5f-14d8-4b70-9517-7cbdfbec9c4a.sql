-- Add UPDATE policy for health_insights table
CREATE POLICY "Users can update own insights"
ON health_insights
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the stuck analysis to error state so user can retry
UPDATE health_insights 
SET analysis_data = jsonb_build_object(
  'status', 'error',
  'message', 'Analysis failed due to missing permissions. Please try uploading again - this has been fixed.'
)
WHERE id = 'b69c1201-cb90-4de2-8b84-c9075cb5327f';