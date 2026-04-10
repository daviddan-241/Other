import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, Play, Loader2, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  role: string;
  content: string;
}

const RUNNABLE_LANGUAGES = new Set([
  'python', 'javascript', 'js', 'typescript', 'ts', 'bash', 'sh',
  'ruby', 'go', 'rust', 'cpp', 'c', 'csharp', 'java', 'php', 'lua'
]);

interface CodeBlockProps {
  language?: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; exitCode: number } | null>(null);
  const [outputVisible, setOutputVisible] = useState(true);

  const lang = language?.toLowerCase().replace('language-', '') || '';
  const canRun = RUNNABLE_LANGUAGES.has(lang);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code }),
        credentials: 'include',
      });
      const data = await res.json();
      setOutput(data);
      setOutputVisible(true);
    } catch {
      setOutput({ stdout: '', stderr: 'Failed to connect to execution engine.', exitCode: 1 });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="my-3 border border-primary/20 overflow-hidden font-mono text-xs sm:text-sm w-full">
      <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary/50" />
          <span className="text-[10px] text-primary/60 uppercase tracking-widest">
            {lang || 'CODE'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6 text-primary/50 hover:text-primary hover:bg-primary/10"
            title="Copy code"
            data-testid="button-copy-code"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          {canRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              disabled={running}
              className="h-6 px-2 text-[10px] text-primary/60 hover:text-primary hover:bg-primary/10 gap-1"
              title="Execute code"
              data-testid="button-run-code"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {running ? 'RUNNING...' : 'RUN'}
            </Button>
          )}
        </div>
      </div>

      <pre className="overflow-x-auto p-3 bg-black/80 leading-relaxed text-xs sm:text-sm">
        <code className={`language-${lang} text-primary/90`}>{code}</code>
      </pre>

      {output && (
        <div className="border-t border-primary/20 bg-black">
          <div
            className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-primary/10 cursor-pointer"
            onClick={() => setOutputVisible(!outputVisible)}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary/60 uppercase tracking-widest">OUTPUT</span>
              <span className={cn(
                "text-[9px] px-1 py-0.5 border",
                output.exitCode === 0
                  ? "text-green-400 border-green-400/30 bg-green-400/5"
                  : "text-red-400 border-red-400/30 bg-red-400/5"
              )}>
                EXIT:{output.exitCode}
              </span>
            </div>
            {outputVisible ? <ChevronUp className="w-3 h-3 text-primary/40" /> : <ChevronDown className="w-3 h-3 text-primary/40" />}
          </div>
          {outputVisible && (
            <div className="p-3 max-h-48 overflow-y-auto">
              {output.stdout && (
                <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap break-all" data-testid="text-code-output">
                  {output.stdout}
                </pre>
              )}
              {output.stderr && (
                <pre className="text-red-400 text-xs leading-relaxed whitespace-pre-wrap break-all mt-2" data-testid="text-code-stderr">
                  {output.stderr}
                </pre>
              )}
              {!output.stdout && !output.stderr && (
                <span className="text-primary/30 text-xs">(no output)</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex w-full mb-2 px-2 sm:px-4",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-bubble-${role}`}
    >
      <div
        className={cn(
          "relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 break-words",
          isUser
            ? "bg-primary/15 border border-primary/30 rounded-br-sm text-right"
            : "bg-zinc-900 border border-white/10 rounded-bl-sm text-left"
        )}
      >
        {/* Sender label */}
        <div className={cn(
          "text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-60",
          isUser ? "text-primary text-right" : "text-primary/80 text-left"
        )}>
          {isUser ? "YOU" : "HACX_GPT"}
        </div>

        {/* Message content */}
        <div className={cn(
          "prose prose-invert prose-p:text-white/90 prose-headings:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 max-w-none font-mono text-sm leading-relaxed",
          isUser ? "text-primary/90" : "text-white/90"
        )}>
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }: any) {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code
                      className="bg-primary/10 border border-primary/20 px-1 py-0.5 text-primary text-xs rounded break-all"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                const lang = className?.replace('language-', '') || '';
                const code = String(children).replace(/\n$/, '');
                return <CodeBlock language={lang} code={code} />;
              },
              pre({ children }: any) {
                return <>{children}</>;
              },
              p({ children }: any) {
                return <p className="mb-2 last:mb-0 break-words whitespace-pre-wrap">{children}</p>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <div className={cn(
          "text-[9px] text-primary/30 mt-1.5 font-mono",
          isUser ? "text-right" : "text-left"
        )}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
