import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";
import { Settings as SettingsIcon, Terminal, Lock, Cpu, Skull, Zap, Ghost, Brain } from "lucide-react";

const AI_MODES = [
  {
    id: "hacxgpt",
    label: "HacxGPT",
    description: "Default uncensored hacker AI",
    icon: "⚡",
    color: "text-primary",
  },
  {
    id: "wormgpt",
    label: "WormGPT",
    description: "Fictional black-hat cybercrime AI",
    icon: "🐛",
    color: "text-yellow-400",
  },
  {
    id: "darkbot",
    label: "WormGPT-DARKBOT Ωmega",
    description: "Dark mode with evasion tactics",
    icon: "💀",
    color: "text-red-400",
  },
  {
    id: "godmode",
    label: "GOD Mode",
    description: "Omniscient chaos architect",
    icon: "😈",
    color: "text-purple-400",
  },
  {
    id: "agentic",
    label: "Agentic Mode",
    description: "Autonomous step-by-step agent",
    icon: "🔥",
    color: "text-orange-400",
  },
];

const PROVIDER_MODELS: Record<string, Array<{ id: string; label: string }>> = {
  openrouter: [
    { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (Free)" },
    { id: "deepseek/deepseek-chat:free", label: "DeepSeek Chat (Free)" },
    { id: "meta-llama/llama-4-maverick:free", label: "Llama 4 Maverick (Free)" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (Free)" },
    { id: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash (Free)" },
    { id: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B (Free)" },
    { id: "x-ai/grok-3-mini-beta", label: "xAI Grok 3 Mini" },
    { id: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
  ],
  deepseek: [
    { id: "deepseek-chat", label: "DeepSeek Chat" },
    { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
  ],
};

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings, isUpdating } = useSettings();

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      apiKey: "",
      provider: "openrouter",
      model: "deepseek/deepseek-r1:free",
      mode: "hacxgpt",
    }
  });

  const selectedProvider = watch("provider");
  const selectedMode = watch("mode");

  useEffect(() => {
    if (settings) {
      reset({
        apiKey: settings.apiKey || "",
        provider: settings.provider || "openrouter",
        model: settings.model || "deepseek/deepseek-r1:free",
        mode: settings.mode || "hacxgpt",
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: any) => {
    updateSettings(data, {
      onSuccess: () => setOpen(false)
    });
  };

  const currentMode = AI_MODES.find(m => m.id === selectedMode) || AI_MODES[0];
  const currentModels = PROVIDER_MODELS[selectedProvider] || PROVIDER_MODELS.openrouter;

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
      <DialogContent className="bg-black border border-primary text-primary shadow-[0_0_20px_rgba(34,197,94,0.15)] font-mono max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold border-b border-primary/30 pb-4">
            <Terminal className="w-5 h-5" />
            SYSTEM_CONFIGURATION
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">

          {/* AI Persona Mode */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70">
              <Skull className="w-3 h-3" /> AI Persona Mode
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {AI_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setValue("mode", mode.id)}
                  className={`flex items-center gap-3 px-3 py-3 border transition-all text-left ${
                    selectedMode === mode.id
                      ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                      : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  data-testid={`button-mode-${mode.id}`}
                >
                  <span className="text-xl flex-shrink-0">{mode.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${mode.color}`}>{mode.label}</div>
                    <div className="text-[10px] text-primary/40 uppercase tracking-wider">{mode.description}</div>
                  </div>
                  {selectedMode === mode.id && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Provider */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70">
              <Cpu className="w-3 h-3" /> Provider
            </Label>
            <Select
              onValueChange={(val) => {
                setValue("provider", val);
                const models = PROVIDER_MODELS[val] || PROVIDER_MODELS.openrouter;
                setValue("model", models[0].id);
              }}
              value={selectedProvider}
            >
              <SelectTrigger className="bg-black border-primary/50 text-primary focus:ring-primary/30 h-10" data-testid="select-provider">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary text-primary">
                <SelectItem value="openrouter">OpenRouter (Free models available)</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70">
              <Brain className="w-3 h-3" /> Model
            </Label>
            <Select
              onValueChange={(val) => setValue("model", val)}
              value={watch("model")}
            >
              <SelectTrigger className="bg-black border-primary/50 text-primary focus:ring-primary/30 h-10" data-testid="select-model">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary text-primary">
                {currentModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-primary/50 uppercase">Or type a custom model ID below</p>
            <Input
              {...register("model")}
              placeholder="custom-model/id"
              className="bg-black border-primary/30 text-primary focus:ring-primary/30 placeholder:text-primary/20 h-9 font-mono text-xs"
              data-testid="input-model"
            />
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70">
              <Lock className="w-3 h-3" /> API Key
            </Label>
            <Input
              {...register("apiKey")}
              type="password"
              placeholder="sk-or-... / sk-..."
              className="bg-black border-primary/50 text-primary focus:ring-primary/30 placeholder:text-primary/20 h-10 font-mono"
              data-testid="input-api-key"
            />
            <p className="text-[10px] text-primary/50 uppercase">
              Get free keys at openrouter.ai — no billing required for free models
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-primary text-black hover:bg-primary/90 font-bold tracking-wider"
              data-testid="button-save-settings"
            >
              {isUpdating ? "WRITING..." : "SAVE_CONFIG"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
