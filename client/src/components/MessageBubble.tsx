import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check, Play, Loader2, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  role: string;
  content: string;
}

const RUNNABLE_LANGUAGES = new Set([
  'python', 'javascript', 'js', 'typescript', 'ts', 'bash', 'sh',
  'ruby', 'go', 'rust', 'cpp', 'c', 'csharp', 'java', 'php', 'lua'
]);

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  js: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  ts: { language: 'typescript', version: '5.0.3' },
  bash: { language: 'bash', version: '5.2.0' },
  sh: { language: 'bash', version: '5.2.0' },
  ruby: { language: 'ruby', version: '3.0.1' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.50.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  php: { language: 'php', version: '8.2.3' },
  lua: { language: 'lua', version: '5.4.4' },
};

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
    <div className="my-4 border border-primary/20 overflow-hidden font-mono text-sm">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary/50" />
          <span className="text-xs text-primary/60 uppercase tracking-widest">
            {lang || 'CODE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
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
              className="h-6 px-2 text-xs text-primary/60 hover:text-primary hover:bg-primary/10 gap-1"
              title="Execute code"
              data-testid="button-run-code"
            >
              {running ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              {running ? 'RUNNING...' : 'RUN'}
            </Button>
          )}
        </div>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4 bg-black/80 leading-relaxed">
        <code className={`language-${lang} text-primary/90`}>{code}</code>
      </pre>

      {/* Output */}
      {output && (
        <div className="border-t border-primary/20 bg-black">
          <div
            className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b border-primary/10 cursor-pointer"
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
            <div className="p-4 max-h-64 overflow-y-auto">
              {output.stdout && (
                <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap" data-testid="text-code-output">
                  {output.stdout}
                </pre>
              )}
              {output.stderr && (
                <pre className="text-red-400 text-xs leading-relaxed whitespace-pre-wrap mt-2" data-testid="text-code-stderr">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 md:gap-4 p-3 md:p-6 mb-2 rounded-none border group",
        isUser
          ? "bg-primary/5 border-primary/20 ml-0 md:ml-12"
          : "bg-black border-primary/10 mr-0 md:mr-12 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      )}
      data-testid={`message-bubble-${role}`}
    >
      <div className={cn(
        "flex-shrink-0 w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center",
        isUser ? "border-primary text-primary" : "border-primary bg-primary text-black"
      )}>
        {isUser ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-2 opacity-50 text-xs uppercase tracking-widest font-bold">
          <span className="text-primary">
            {isUser ? "OPERATOR" : "HACX_GPT_SYSTEM"}
          </span>
          <span className="text-[10px]">• {new Date().toLocaleTimeString()}</span>
        </div>

        <div className="prose prose-invert prose-p:text-primary/90 prose-headings:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 max-w-none font-mono text-sm md:text-base leading-relaxed">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }: any) {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code
                      className="bg-primary/10 border border-primary/20 px-1 py-0.5 text-primary text-sm"
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
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
