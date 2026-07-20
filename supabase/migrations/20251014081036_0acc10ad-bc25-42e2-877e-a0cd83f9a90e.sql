-- Add is_invalidated column to health_insights table
ALTER TABLE health_insights 
ADD COLUMN IF NOT EXISTS is_invalidated BOOLEAN DEFAULT false;

-- Add index for faster queries on invalidation status
CREATE INDEX IF NOT EXISTS idx_health_insights_is_invalidated 
ON health_insights(user_id, is_invalidated);

-- Create trigger function to invalidate insights when reports are deleted
CREATE OR REPLACE FUNCTION invalidate_insights_on_report_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark insights as invalidated when a referenced report is deleted
  UPDATE health_insights
  SET 
    is_invalidated = true,
    last_updated_at = now()
  WHERE OLD.id = ANY(report_ids)
    AND user_id = OLD.user_id
    AND is_invalidated = false;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to reports table
CREATE TRIGGER on_report_deleted_invalidate_insights
  AFTER DELETE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_insights_on_report_deletion();