import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, Play, Loader2, Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface MessageBubbleProps {
  role: string;
  content: string;
  personaName?: string;
}

const RUNNABLE_LANGUAGES = new Set([
  'python', 'javascript', 'js', 'typescript', 'ts', 'bash', 'sh',
  'ruby', 'go', 'rust', 'cpp', 'c', 'csharp', 'java', 'php', 'lua'
]);

function CodeBlock({ language, code }: { language?: string; code: string }) {
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
      setOutput({ stdout: '', stderr: 'Execution engine unavailable.', exitCode: 1 });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden bg-black/70 border border-white/10 text-xs w-full">
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-green-400/60" />
          <span className="text-[10px] text-green-400/60 uppercase tracking-widest font-mono">{lang || 'code'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="text-white/40 hover:text-white/80 transition-colors" data-testid="button-copy-code">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {canRun && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1 text-[10px] text-green-400/70 hover:text-green-400 font-mono transition-colors"
              data-testid="button-run-code"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {running ? 'running' : 'run'}
            </button>
          )}
        </div>
      </div>
      <pre className="overflow-x-auto p-3 font-mono leading-relaxed">
        <code className={`language-${lang} text-green-300/80 text-[13px]`}>{code}</code>
      </pre>
      {output && (
        <div className="border-t border-white/10">
          <div
            className="flex items-center justify-between px-3 py-1.5 bg-white/5 cursor-pointer"
            onClick={() => setOutputVisible(!outputVisible)}
          >
            <span className={cn("text-[10px] font-mono uppercase tracking-widest", output.exitCode === 0 ? "text-green-400/60" : "text-red-400/60")}>
              {output.exitCode === 0 ? '✓ output' : '✗ error'}
            </span>
            {outputVisible ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
          </div>
          {outputVisible && (
            <pre className={cn("p-3 text-[13px] font-mono whitespace-pre-wrap break-words leading-relaxed", output.exitCode === 0 ? "text-green-300/80" : "text-red-400/80")}>
              {output.stdout || output.stderr || 'no output'}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export function MessageBubble({ role, content, personaName }: MessageBubbleProps) {
  const isUser = role === "user";
  const label = personaName || "HACX_GPT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex w-full px-3 sm:px-4 mb-0.5", isUser ? "justify-end" : "justify-start")}
      data-testid={`message-${role}`}
    >
      <div className={cn("max-w-[84%] sm:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        {!isUser && (
          <div className="text-[11px] font-bold text-red-500 mb-1 pl-1 font-mono tracking-wide uppercase">
            [{label}]
          </div>
        )}

        <div className={cn(
          "px-4 py-3 break-words",
          isUser
            ? "bg-[#5c0a0a] text-white rounded-[20px] rounded-br-[5px] shadow-lg"
            : "bg-[#1e1e1e] text-white/95 rounded-[20px] rounded-bl-[5px] border border-white/[0.06] shadow-sm"
        )}>
          <div className="text-[15px] leading-[1.58] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1 [&_li]:mb-0.5 [&_a]:text-blue-400 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-white/60 [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ className, children, ...props }: any) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-[13px] font-mono text-green-300" {...props}>
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
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        <div className={cn("text-[11px] text-white/20 mt-1 px-1", isUser ? "text-right" : "text-left")}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
