import { useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useMessages, useChatCompletion } from "@/hooks/use-messages";
import { MessageBubble } from "@/components/MessageBubble";
import { TerminalInput } from "@/components/TerminalInput";
import { Loader2, Terminal } from "lucide-react";
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  const handleSend = (content: string) => {
    if (conversationId) {
      queryClient.setQueryData([api.messages.list.path, conversationId], (old: any[]) => [
        ...(old || []),
        { id: Date.now(), role: 'user', content, createdAt: new Date().toISOString() }
      ]);
    }

    sendMessage(
      { message: content, conversationId },
      {
        onSuccess: (data) => {
          if (!conversationId && data.conversationId) {
            setLocation(`/chat/${data.conversationId}`);
          }
        }
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0d0d0d] relative">
      <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
        <div className="py-4 space-y-0.5 min-h-full flex flex-col justify-end">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : !conversationId ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-5 px-6">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Terminal className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-ping opacity-40" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-white/60 font-mono text-sm tracking-wider">HACX_GPT ONLINE</p>
                <p className="text-white/25 text-xs font-mono">Select a persona and start typing</p>
              </div>
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
                <div className="flex w-full px-3 sm:px-4 mb-0.5 justify-start">
                  <div className="max-w-[84%] sm:max-w-[70%]">
                    <div className="text-[11px] font-bold text-red-500 mb-1 pl-1 font-mono tracking-wide uppercase">
                      [HACX_GPT]
                    </div>
                    <div className="bg-[#1e1e1e] border border-white/[0.06] rounded-[20px] rounded-bl-[5px] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-2" />
            </>
          )}
        </div>
      </div>

      <TerminalInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
