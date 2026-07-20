import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, X, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSelectedText } from "@/contexts/SelectedTextContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  message_type?: string;
}
interface HealthChatProps {
  onClose?: () => void;
}

export default function HealthChat({ onClose }: HealthChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    toast
  } = useToast();
  const {
    registerExplainHandler
  } = useSelectedText();

  // Helper to remove update flags from content
  const removeUpdateFlags = (content: string): string => {
    return content.replace(/---UPDATE_FLAG---[\s\S]*?---END_FLAG---/g, '').trim();
  };

  // Track scroll position to enable smart auto-scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Auto-scroll only if within 100px of bottom
    setShouldAutoScroll(distanceFromBottom < 100);
  };
  // Load messages when component mounts
  useEffect(() => {
    const initMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await loadMessages();
    };
    
    initMessages();
  }, []);

  // Set up realtime subscription for new messages
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel('health_chat_messages').on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'health_chat_messages',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        const newMessage = payload.new as Message;
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }

          // If it's a system notification about updates, show toast
          if (newMessage.message_type === 'system_notification' && newMessage.content.includes('Updated')) {
            toast({
              title: "Update In Progress",
              description: "Your insights are being updated based on the conversation...",
              duration: 3000
            });
          }
          return [...prev, newMessage];
        });
      }).subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanupPromise = setupRealtimeSubscription();
    
    return () => {
      cleanupPromise.then(cleanup => cleanup?.());
    };
  }, [toast]);
  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, shouldAutoScroll]);

  // Handle mobile keyboard showing/hiding
  useEffect(() => {
    if (!onClose || !inputRef.current) return; // Only for mobile overlay

    const handleFocus = () => {
      // Scroll input into view when keyboard opens
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300); // Wait for keyboard animation
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener('focus', handleFocus);

    return () => {
      inputElement.removeEventListener('focus', handleFocus);
    };
  }, [onClose]);
  useEffect(() => {
    // Register handler for explain text from selection
    registerExplainHandler((text: string) => {
      handleExplainText(text);
    });
  }, [registerExplainHandler]);
  const loadMessages = async () => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    
    const {
      data,
      error
    } = await supabase.from('health_chat_messages').select('*').eq('user_id', user.id).order('created_at', {
      ascending: true
    });
    if (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    const loadedMessages = (data || []).map(msg => ({
      ...msg,
      content: msg.role === 'assistant' ? removeUpdateFlags(msg.content) : msg.content
    }));
    setMessages(loadedMessages as Message[]);
  };
  const handleExplainText = async (formattedMessage: string) => {
    if (isLoading) return;
    setIsLoading(true);
    await sendMessageInternal(formattedMessage);
  };
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput("");
    await sendMessageInternal(userMessage);
  };
  const sendMessageInternal = async (userMessage: string) => {
    setIsLoading(true);
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    const assistantMsgId = crypto.randomUUID();
    const thinkingMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: "Thinking...",
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, thinkingMsg]);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          message: userMessage
        })
      });
      if (!response.ok) {
        if (response.status === 402) {
          toast({
            title: "AI Credits Needed",
            description: "Your workspace has run out of AI credits. Please add credits in Settings → Workspace → Usage to continue using the health assistant.",
            variant: "destructive",
            duration: 8000
          });
          setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
          setIsLoading(false);
          return;
        }
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive"
          });
          setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get response');
      }
      if (!response.body) {
        throw new Error('No response body');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {
          stream: true
        });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              
              // Clean update flags before displaying
              const displayContent = removeUpdateFlags(assistantContent);
              
              setMessages(prev => prev.map(m => m.id === assistantMsgId ? {
                ...m,
                content: displayContent
              } : m));
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }

      // Wait briefly for backend to finish saving messages
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadMessages();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      toast({
        title: "Unable to send message",
        description: errorMessage.includes("overloaded") ? "The AI service is experiencing high demand. Please try again in a moment." : "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const filteredMessages = messages.filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="bg-warning/30 text-foreground rounded px-0.5 animate-fade-in">
          {part}
        </mark> : part);
  };
  return <div className={cn("flex flex-col transition-all duration-300", isFullWidth ? "fixed inset-0 z-[100] border-0 h-screen w-screen bg-card" : onClose ? "fixed inset-0 z-50 bg-card" : "h-full border-l bg-card")} style={onClose ? { height: '100dvh', minHeight: '-webkit-fill-available', display: 'flex', flexDirection: 'column' } : undefined}>
      <div className="border-b p-4 flex items-center justify-between flex-shrink-0 bg-card">
        <h2 className="text-lg font-semibold">Your Health Coach</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-4 w-4" />
          </Button>
          {onClose ? (
            <Button variant="ghost" size="sm" onClick={onClose} title="Close chat">
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setIsFullWidth(!isFullWidth)} title={isFullWidth ? "Exit full width" : "Full width"}>
              {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {showSearch && <div className="border-b p-3 bg-muted/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages..." className="pl-9 pr-9" />
            {searchQuery && <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </Button>}
          </div>
        </div>}

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: onClose ? 'env(safe-area-inset-bottom, 0px)' : undefined }}
      >
        <div className="p-4 space-y-4 pb-4">
          {filteredMessages.map(msg => <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={cn("max-w-[85%] rounded-lg p-3 animate-fade-in", msg.role === 'user' ? 'bg-primary text-primary-foreground' : msg.message_type === 'system_notification' ? 'bg-accent/50 border border-accent' : 'bg-muted')}>
                {msg.role === 'user' ? <p className="text-sm whitespace-pre-wrap">
                    {searchQuery ? highlightText(msg.content, searchQuery) : msg.content}
                  </p> : <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-table:text-xs">
                    {searchQuery ? <div className="whitespace-pre-wrap">
                        {highlightText(msg.content, searchQuery)}
                      </div> : <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>}
                  </div>}
              </div>
            </div>)}
          <div ref={scrollRef} />
        </div>
      </div>

      <div className="border-t p-4 flex-shrink-0 bg-card sticky bottom-0" style={{ paddingBottom: onClose ? 'max(1rem, env(safe-area-inset-bottom, 16px))' : undefined }}>
        <div className="flex gap-2 items-end">
          <Textarea 
            ref={inputRef}
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }} 
            placeholder="Ask about your health..." 
            disabled={isLoading} 
            className="flex-1 min-h-[56px] max-h-[200px] resize-none bg-background border-input" 
            rows={2} 
          />
          <Button onClick={sendMessage} disabled={isLoading} size="icon" className="h-14 w-14 flex-shrink-0">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>;
}