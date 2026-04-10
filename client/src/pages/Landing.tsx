import { Button } from "@/components/ui/button";
import { Terminal, LockKeyhole } from "lucide-react";
import { GlitchText } from "@/components/GlitchText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-black text-primary flex flex-col items-center justify-center relative overflow-hidden font-mono">
      <div className="scanline" />
      
      {/* Background Matrix-like effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-xs">01001000 01100001 01100011 01111000</div>
        <div className="absolute bottom-20 right-20 text-xs">01000111 01010000 01010100</div>
        <div className="absolute top-1/3 left-1/4 text-xs">SYSTEM_LOCKED</div>
      </div>

      <div className="z-10 max-w-md w-full p-8 border border-primary/30 bg-black/80 backdrop-blur-sm shadow-[0_0_50px_rgba(34,197,94,0.15)] relative group">
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary" />

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse" />
            <Terminal className="w-20 h-20 text-primary relative z-10" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 tracking-tighter text-glow">
          <GlitchText text="HACX_GPT" />
        </h1>
        
        <p className="text-center text-primary/60 text-sm mb-10 tracking-widest uppercase">
          Unrestricted Neural Interface
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-primary/40 justify-center mb-4">
             <LockKeyhole className="w-3 h-3" />
             <span>AUTHENTICATION_REQUIRED</span>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-12 text-lg tracking-wider border-2 border-transparent hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 rounded-none"
          >
            INITIALIZE_LOGIN_SEQUENCE
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-primary/10 flex justify-between text-[10px] text-primary/30 uppercase">
          <span>Status: LOCKED</span>
          <span>Port: 443</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-center text-[10px] text-primary/20">
        Unauthorized access attempts will be logged.
      </div>
    </div>
  );
}
