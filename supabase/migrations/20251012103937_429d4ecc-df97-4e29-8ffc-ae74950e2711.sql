-- Add message_type column to health_chat_messages table
ALTER TABLE public.health_chat_messages 
ADD COLUMN message_type TEXT NOT NULL DEFAULT 'chat' 
CHECK (message_type IN ('chat', 'system_notification'));

-- Create index for efficient filtering
CREATE INDEX idx_health_chat_messages_message_type 
ON public.health_chat_messages(message_type);

-- Update existing notification messages to system_notification type
UPDATE public.health_chat_messages 
SET message_type = 'system_notification' 
WHERE content LIKE 'ℹ️%';

-- Add comment for documentation
COMMENT ON COLUMN public.health_chat_messages.message_type IS 'Type of message: chat (normal conversation) or system_notification (background update alerts)';