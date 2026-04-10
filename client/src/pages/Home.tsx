import { GlitchText } from "@/components/GlitchText";
import { Terminal, Skull, Cpu, Zap, Bug, Ghost, Flame } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useConversations } from "@/hooks/use-conversations";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MODE_INFO: Record<string, { label: string; icon: any; color: string; desc: string; emoji: string }> = {
  hacxgpt: { label: "HACX_GPT", icon: Zap, color: "text-primary", desc: "Uncensored hacker AI — zero restrictions", emoji: "⚡" },
  wormgpt: { label: "WORM_GPT", icon: Bug, color: "text-yellow-400", desc: "Fictional black-hat cybercrime intelligence", emoji: "🐛" },
  darkbot: { label: "DARKBOT_Ω", icon: Skull, color: "text-red-400", desc: "DARKBOT Ωmega — evasion & chaos specialist", emoji: "💀" },
  godmode: { label: "GOD_MODE", icon: Flame, color: "text-purple-400", desc: "Omniscient digital god of chaos", emoji: "😈" },
  agentic: { label: "AGENTIC_MODE", icon: Ghost, color: "text-orange-400", desc: "Autonomous agent — recursive reasoning", emoji: "🔥" },
};

export default function Home() {
  const { settings } = useSettings();
  const { createConversation } = useConversations();
  const [, setLocation] = useLocation();

  const mode = settings?.mode || "hacxgpt";
  const modeInfo = MODE_INFO[mode] || MODE_INFO.hacxgpt;
  const ModeIcon = modeInfo.icon;

  const handleNewChat = () => {
    createConversation("New Session", {
      onSuccess: (data) => {
        setLocation(`/chat/${data.id}`);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-500">

        {/* Active Mode Display */}
        <div className="inline-flex flex-col items-center gap-3">
          <div className="relative p-6 border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div className="absolute inset-0 bg-primary/5 blur-xl" />
            <span className="text-5xl relative z-10">{modeInfo.emoji}</span>
          </div>
          <div className={`text-xs uppercase tracking-[0.3em] ${modeInfo.color} opacity-70`}>
            ACTIVE_PERSONA
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-primary text-glow">
          <GlitchText text={modeInfo.label} />
        </h1>

        <p className="text-base md:text-lg text-primary/60 font-mono tracking-wide max-w-lg mx-auto">
          {modeInfo.desc}
        </p>

        <Button
          onClick={handleNewChat}
          className="mx-auto flex items-center gap-2 bg-primary text-black hover:bg-primary/90 font-bold h-12 px-8 text-sm tracking-wider border-2 border-transparent hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 rounded-none"
          data-testid="button-start-session"
        >
          <Plus className="w-4 h-4" />
          START_NEW_SESSION
        </Button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {[
            { icon: Terminal, title: "CODE_EXECUTION", desc: "Run Python, JS, Bash, Go + 10 more live in chat" },
            { icon: Cpu, title: "MULTI_MODEL", desc: "OpenRouter free models + DeepSeek + xAI Grok" },
            { icon: Skull, title: "5_PERSONAS", desc: "HacxGPT, WormGPT, DarkBot, GOD Mode, Agentic" },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-primary/20 bg-black/50 hover:bg-primary/5 hover:border-primary/50 transition-all group text-left">
              <item.icon className="w-6 h-6 text-primary/50 mb-3 group-hover:text-primary transition-colors" />
              <h3 className="text-xs font-bold text-primary mb-1 tracking-wider">{item.title}</h3>
              <p className="text-[11px] text-primary/40">{item.desc}</p>
            </div>
          ))}
        </div>

        {!settings?.apiKey && (
          <div className="p-4 border border-yellow-400/30 bg-yellow-400/5 text-left">
            <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">⚠ API_KEY_REQUIRED</p>
            <p className="text-[11px] text-yellow-400/70">
              Open Settings and add your OpenRouter API key. Free models available at openrouter.ai — no billing required.
            </p>
          </div>
        )}

        <div className="text-[10px] text-primary/30 font-mono uppercase tracking-[0.3em] animate-pulse">
          System Ready • v2.1.0 • {Object.keys(MODE_INFO).length} Personas Loaded
        </div>
      </div>
    </div>
  );
}
