import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollH, 160) + "px";
    }
  }, [input]);

  return (
    <div className="flex-shrink-0 bg-[#0d0d0d] border-t border-white/[0.08] px-3 py-3 pb-safe">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 max-w-3xl mx-auto"
      >
        <div className={cn(
          "flex-1 flex items-end bg-[#1c1c1e] rounded-[22px] px-4 py-2.5 border transition-colors",
          disabled ? "border-white/5 opacity-60" : "border-white/10 focus-within:border-white/20"
        )}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Message..."
            data-testid="input-message"
            className="flex-1 bg-transparent border-none text-white placeholder:text-white/25 focus:ring-0 resize-none max-h-[160px] min-h-[24px] py-0 px-0 text-[15px] leading-6 outline-none font-sans"
            rows={1}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          data-testid="button-send"
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            input.trim() && !disabled
              ? "bg-green-500 hover:bg-green-400 active:scale-95 shadow-lg shadow-green-500/20"
              : "bg-white/10 opacity-40"
          )}
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>
    </div>
  );
}
