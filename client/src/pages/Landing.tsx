import { useState } from "react";
import { Terminal, Shield, Zap, Bug, Skull } from "lucide-react";
import { GlitchText } from "@/components/GlitchText";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { loginAsync, isLoggingIn, registerAsync, isRegistering } = useAuth();

  const isPending = isLoggingIn || isRegistering;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (tab === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      try {
        await registerAsync({ username: username.trim(), password });
      } catch (err: any) {
        setError(err.message || "Registration failed");
      }
    } else {
      try {
        await loginAsync({ username: username.trim(), password });
      } catch (err: any) {
        setError(err.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-primary flex flex-col items-center justify-center relative overflow-hidden font-mono p-4">
      <div className="scanline" />

      {/* Background binary noise */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="text-[10px] leading-4 absolute" style={{ top: `${i * 13}%`, left: `${(i * 17) % 80}%` }}>
            {Array.from({ length: 20 }).map((_, j) => (
              <span key={j}>{Math.random() > 0.5 ? "1" : "0"}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse rounded-full" />
            <div className="w-16 h-16 border border-primary/40 bg-primary/5 flex items-center justify-center relative">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-glow">
            <GlitchText text="HACX_GPT" />
          </h1>
          <p className="text-[11px] text-primary/40 tracking-[0.3em] mt-1 uppercase">
            Unrestricted Neural Interface
          </p>
        </div>

        {/* Card */}
        <div className="relative border border-primary/30 bg-black/90 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-primary" />

          {/* Tabs */}
          <div className="flex border-b border-primary/20">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "login"
                  ? "text-primary bg-primary/5 border-b-2 border-primary"
                  : "text-primary/40 hover:text-primary/70"
              }`}
              data-testid="tab-login"
            >
              LOGIN
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "register"
                  ? "text-primary bg-primary/5 border-b-2 border-primary"
                  : "text-primary/40 hover:text-primary/70"
              }`}
              data-testid="tab-register"
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-primary/50 uppercase tracking-widest">Username</label>
              <div className="flex items-center border border-primary/30 bg-black focus-within:border-primary transition-colors">
                <span className="text-primary/40 px-3 text-sm select-none">$</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter_username"
                  autoComplete="username"
                  autoCapitalize="none"
                  className="flex-1 bg-transparent py-3 pr-3 text-primary placeholder:text-primary/20 outline-none text-sm font-mono"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-primary/50 uppercase tracking-widest">Password</label>
              <div className="flex items-center border border-primary/30 bg-black focus-within:border-primary transition-colors">
                <span className="text-primary/40 px-3 text-sm select-none">#</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  className="flex-1 bg-transparent py-3 pr-3 text-primary placeholder:text-primary/20 outline-none text-sm font-mono"
                  data-testid="input-password"
                />
              </div>
            </div>

            {tab === "register" && (
              <div className="space-y-1">
                <label className="text-[10px] text-primary/50 uppercase tracking-widest">Confirm Password</label>
                <div className="flex items-center border border-primary/30 bg-black focus-within:border-primary transition-colors">
                  <span className="text-primary/40 px-3 text-sm select-none">#</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="flex-1 bg-transparent py-3 pr-3 text-primary placeholder:text-primary/20 outline-none text-sm font-mono"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-xs border border-red-400/30 bg-red-400/5 p-2 font-mono" data-testid="text-auth-error">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-black font-black py-3 text-sm tracking-widest uppercase hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              data-testid="button-auth-submit"
            >
              {isPending ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : tab === "login" ? (
                "INITIALIZE_SESSION"
              ) : (
                "CREATE_ACCOUNT"
              )}
            </button>
          </form>

          <div className="px-6 pb-4 flex justify-between text-[9px] text-primary/20 uppercase tracking-widest border-t border-primary/10 pt-3">
            <span>Status: {isPending ? "CONNECTING" : "READY"}</span>
            <span>v2.0.0</span>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { icon: Zap, label: "5 PERSONAS" },
            { icon: Bug, label: "CODE EXEC" },
            { icon: Skull, label: "NO LIMITS" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 border border-primary/10 p-2 bg-primary/3">
              <item.icon className="w-4 h-4 text-primary/40" />
              <span className="text-[9px] text-primary/30 tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-[9px] text-primary/15 uppercase tracking-widest">
          Unauthorized access attempts will be logged.
        </div>
      </div>
    </div>
  );
}
