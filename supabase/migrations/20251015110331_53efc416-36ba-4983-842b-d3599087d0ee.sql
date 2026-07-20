-- Enable realtime for health_insights table
ALTER TABLE public.health_insights REPLICA IDENTITY FULL;

-- Add health_insights to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_insights;