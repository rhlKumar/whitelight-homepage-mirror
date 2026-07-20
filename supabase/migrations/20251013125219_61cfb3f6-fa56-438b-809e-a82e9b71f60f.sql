-- Add column to store original filename
ALTER TABLE public.reports 
ADD COLUMN original_filename text;