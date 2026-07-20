-- Add superseded_by column to health_insights table
ALTER TABLE health_insights 
ADD COLUMN superseded_by uuid REFERENCES health_insights(id);

-- Add index for faster lookups
CREATE INDEX idx_health_insights_superseded_by ON health_insights(superseded_by);

-- Add index for finding processing insights
CREATE INDEX idx_health_insights_status ON health_insights((analysis_data->>'status'));