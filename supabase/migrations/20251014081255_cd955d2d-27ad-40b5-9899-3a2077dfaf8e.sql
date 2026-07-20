-- Fix search path for trigger function to address security warning
DROP FUNCTION IF EXISTS invalidate_insights_on_report_deletion() CASCADE;

CREATE OR REPLACE FUNCTION invalidate_insights_on_report_deletion()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Reattach trigger to reports table
CREATE TRIGGER on_report_deleted_invalidate_insights
  AFTER DELETE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_insights_on_report_deletion();