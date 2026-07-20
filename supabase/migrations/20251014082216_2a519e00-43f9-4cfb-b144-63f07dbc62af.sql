-- Clean up invalidation system and implement deletion cascade
-- Drop existing invalidation trigger and function
DROP TRIGGER IF EXISTS on_report_deleted_invalidate_insights ON public.reports;
DROP FUNCTION IF EXISTS invalidate_insights_on_report_deletion() CASCADE;

-- Create function to delete insights when a report is deleted
CREATE OR REPLACE FUNCTION delete_insights_on_report_deletion()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete insights that reference the deleted report
  DELETE FROM health_insights
  WHERE OLD.id = ANY(report_ids)
    AND user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$;

-- Create trigger to delete insights when report is deleted
CREATE TRIGGER on_report_deleted_delete_insights
  AFTER DELETE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION delete_insights_on_report_deletion();

-- Create function to delete extracted markers when a report is deleted
CREATE OR REPLACE FUNCTION delete_markers_on_report_deletion()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all markers associated with the deleted report
  DELETE FROM extracted_markers
  WHERE report_id = OLD.id
    AND user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$;

-- Create trigger to delete markers when report is deleted
CREATE TRIGGER on_report_deleted_delete_markers
  AFTER DELETE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION delete_markers_on_report_deletion();