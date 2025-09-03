-- Create alert logs table for tracking alert deliveries
CREATE TABLE public.alert_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  recipients_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for alert logs (only admins should see these)
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for alert logs (restrict access)
CREATE POLICY "Only service can manage alert logs" 
ON public.alert_logs 
FOR ALL 
USING (false);

-- Create index for better performance
CREATE INDEX idx_alert_logs_city ON public.alert_logs(city);
CREATE INDEX idx_alert_logs_created_at ON public.alert_logs(created_at DESC);