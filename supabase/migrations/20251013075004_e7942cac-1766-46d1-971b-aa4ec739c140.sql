-- Normalize all existing file_url values to store only the file path
-- This strips the public URL prefix from existing reports
UPDATE reports 
SET file_url = SUBSTRING(file_url FROM 'health-reports/(.*)$')
WHERE file_url LIKE '%supabase.co/storage%';