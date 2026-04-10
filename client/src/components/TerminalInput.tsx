import { useState, useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function TerminalInput({ onSend, disabled }: TerminalInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="relative border-t border-primary/20 bg-black p-4 pb-6">
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute inset-0 bg-primary/5 blur-md -z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-black/50 border border-primary/30 p-3 rounded-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <div className="flex-shrink-0 pb-3 pl-2 text-primary animate-pulse">
            <Terminal className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0 relative">
             <div className="absolute top-0 left-0 text-xs text-primary/40 pointer-events-none font-mono tracking-wider mb-1">
               user@hacxgpt:~$ input_command
             </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Enter command or message..."
              className="w-full bg-transparent border-none text-primary placeholder:text-primary/20 focus:ring-0 resize-none max-h-[200px] min-h-[24px] py-6 px-0 font-mono text-base leading-relaxed outline-none"
              rows={1}
            />
          </div>

          <Button 
            type="submit" 
            disabled={!input.trim() || disabled}
            size="icon"
            className="rounded-none bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors mb-1"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        
        <div className="absolute -bottom-5 right-0 text-[10px] text-primary/30 uppercase tracking-widest">
          {disabled ? "SYSTEM_PROCESSING..." : "READY_FOR_INPUT"}
        </div>
      </div>
    </div>
  );
}
