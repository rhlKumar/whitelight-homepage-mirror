-- Create storage bucket for health reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-reports', 'health-reports', false);

-- Create RLS policies for health reports bucket
CREATE POLICY "Users can upload their own reports"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own reports"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own reports"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);