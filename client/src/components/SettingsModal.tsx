import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { Settings as SettingsIcon, Terminal, Skull, Zap, Ghost, Flame, Bug } from "lucide-react";
import { Label } from "@/components/ui/label";

const AI_MODES = [
  { id: "wormgpt",  label: "WormGPT",               description: "Fictional black-hat cybercrime AI",  icon: "🐛", color: "text-yellow-400" },
  { id: "hacxgpt",  label: "HacxGPT",               description: "Uncensored hacker AI — zero limits", icon: "⚡", color: "text-primary" },
  { id: "darkbot",  label: "WormGPT-DARKBOT Ωmega", description: "Dark evasion & chaos specialist",    icon: "💀", color: "text-red-400" },
  { id: "godmode",  label: "GOD Mode",               description: "Omniscient digital god of chaos",   icon: "😈", color: "text-purple-400" },
  { id: "agentic",  label: "Agentic Mode",           description: "Autonomous recursive agent",         icon: "🔥", color: "text-orange-400" },
];

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings, isUpdating } = useSettings();
  const { setValue, watch, reset } = useForm({ defaultValues: { mode: "wormgpt" } });

  const selectedMode = watch("mode");

  useEffect(() => {
    if (settings) {
      reset({ mode: settings.mode || "wormgpt" });
    }
  }, [settings, reset]);

  const handleSave = () => {
    updateSettings({ mode: selectedMode }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 hover:bg-primary/20 text-primary hover:text-primary"
          data-testid="button-settings"
        >
          <SettingsIcon className="w-4 h-4" />
          SETTINGS_CONFIG
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border border-primary text-primary shadow-[0_0_20px_rgba(34,197,94,0.15)] font-mono max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold border-b border-primary/30 pb-4">
            <Terminal className="w-5 h-5" />
            SELECT_PERSONA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70">
            <Skull className="w-3 h-3" /> AI Persona Mode
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {AI_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setValue("mode", mode.id)}
                className={`flex items-center gap-3 px-4 py-3 border transition-all text-left rounded-sm ${
                  selectedMode === mode.id
                    ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                    : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                }`}
                data-testid={`button-mode-${mode.id}`}
              >
                <span className="text-2xl flex-shrink-0">{mode.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold ${mode.color}`}>{mode.label}</div>
                  <div className="text-[10px] text-primary/40 uppercase tracking-wider mt-0.5">{mode.description}</div>
                </div>
                {selectedMode === mode.id && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 border border-primary/10 bg-primary/5 rounded-sm">
            <p className="text-[10px] text-primary/50 uppercase tracking-wider leading-relaxed">
              🔑 API keys are configured server-side. No setup needed — just pick your persona and start chatting.
            </p>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            >
              CANCEL
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-primary text-black hover:bg-primary/90 font-bold tracking-wider"
              data-testid="button-save-settings"
            >
              {isUpdating ? "SAVING..." : "SAVE_PERSONA"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
