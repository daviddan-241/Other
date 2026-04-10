import { useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useMessages, useChatCompletion } from "@/hooks/use-messages";
import { MessageBubble } from "@/components/MessageBubble";
import { TerminalInput } from "@/components/TerminalInput";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function Chat() {
  const { id } = useParams();
  const conversationId = id ? parseInt(id) : undefined;
  const { data: messages, isLoading: loadingMessages } = useMessages(conversationId);
  const { mutate: sendMessage, isPending: isSending } = useChatCompletion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  const handleSend = (content: string) => {
    // Optimistically add user message to cache if in existing chat
    if (conversationId) {
      queryClient.setQueryData([api.messages.list.path, conversationId], (old: any[]) => {
        return [...(old || []), { 
          id: Date.now(), 
          role: 'user', 
          content, 
          createdAt: new Date().toISOString() 
        }];
      });
    }

    sendMessage(
      { message: content, conversationId }, 
      {
        onSuccess: (data) => {
          // If we were on the new chat page (no ID), redirect to the new conversation
          if (!conversationId && data.conversationId) {
            setLocation(`/chat/${data.conversationId}`);
          }
        }
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 px-0 space-y-1 scroll-smooth">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !conversationId ? (
          <div className="flex flex-col items-center justify-center h-full text-primary/30 space-y-4">
             <div className="w-16 h-16 border border-primary/20 flex items-center justify-center rounded-full bg-primary/5">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-primary opacity-20"></span>
             </div>
             <p className="font-mono tracking-widest text-sm">INITIATE_NEW_SEQUENCE...</p>
          </div>
        ) : (
          <>
            {messages?.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                role={msg.role} 
                content={msg.content} 
              />
            ))}
            
            {isSending && (
              <div className="flex w-full px-2 sm:px-4 justify-start mb-2">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] sm:max-w-[75%]">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 text-primary/80">HACX_GPT</div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="font-mono text-primary/60 animate-pulse tracking-widest text-xs">PROCESSING...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <TerminalInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
