-- Add DELETE policy for health_insights table to allow users to delete their own insights
CREATE POLICY "Users can delete own insights"
ON health_insights
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);