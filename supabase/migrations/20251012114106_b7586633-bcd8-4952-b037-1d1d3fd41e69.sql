-- Create extracted_markers table to store historical marker data
CREATE TABLE IF NOT EXISTS extracted_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  marker_name TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  reference_range TEXT,
  report_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add extraction_status to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS extraction_status TEXT DEFAULT 'pending';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS extraction_error TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_extracted_markers_user_id ON extracted_markers(user_id);
CREATE INDEX IF NOT EXISTS idx_extracted_markers_report_date ON extracted_markers(report_date);

-- Enable RLS
ALTER TABLE extracted_markers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for extracted_markers
CREATE POLICY "Users can view own markers"
ON extracted_markers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own markers"
ON extracted_markers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own markers"
ON extracted_markers
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);