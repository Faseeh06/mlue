"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { preferencesStorage, apiKeyStorage, aiModelStorage, voiceModeStorage, storage, type AIModel, type VoiceMode } from "@/lib/storage";
import { isWhisperAvailable } from "@/lib/whisper";
import LandingHeader from "@/components/common/landing-header";
import { DollarSign, Download, Trash2, CheckCircle2, Globe, Key, Eye, EyeOff, ExternalLink, Sparkles, Mic } from "lucide-react";

const currencies = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "INR", label: "Indian Rupee" },
  { code: "PKR", label: "Pakistani Rupee" },
  { code: "NGN", label: "Nigerian Naira" },
  { code: "ZAR", label: "South African Rand" },
  { code: "KES", label: "Kenyan Shilling" },
  { code: "GHS", label: "Ghanaian Cedi" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);
  const [aiModel, setAiModel] = useState<AIModel>("gemini");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false);
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("browser");

  useEffect(() => {
    const prefs = preferencesStorage.get();
    const storedCurrency = prefs.currency || "USD";
    setCurrency(storedCurrency);
    
    // Load AI model preference
    const model = aiModelStorage.get();
    setAiModel(model);
    
    // Load voice mode preference
    const voice = voiceModeStorage.get();
    setVoiceMode(voice);
    
    // Load API keys (masked)
    const storedGeminiKey = apiKeyStorage.get();
    if (storedGeminiKey) {
      const masked = '•'.repeat(Math.max(0, storedGeminiKey.length - 4)) + storedGeminiKey.slice(-4);
      setGeminiApiKey(masked);
    }
    
    const storedGroqKey = apiKeyStorage.getGroq();
    if (storedGroqKey) {
      const masked = '•'.repeat(Math.max(0, storedGroqKey.length - 4)) + storedGroqKey.slice(-4);
      setGroqApiKey(masked);
    }
    
    // Mark initial load as complete after a short delay to ensure state is set
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
  }, []);

  // Auto-save on currency change (only after initial load)
  useEffect(() => {
    if (isInitialLoad || !currency) return;
    
    const prefs = preferencesStorage.get();
    const currentCurrency = prefs.currency || "USD";
    if (currency !== currentCurrency) {
      preferencesStorage.set({ ...prefs, currency });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [currency, isInitialLoad]);
  
  // Handle currency change from Select component
  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    // Save immediately when user changes it
    const prefs = preferencesStorage.get();
    preferencesStorage.set({ ...prefs, currency: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAll = () => {
    const ok = window.confirm('This will delete all local data (transactions, budgets, categories, accounts, settings, API key). Continue?');
    if (!ok) return;
    // Known keys used by the app
    try {
      storage.remove('mlue-finance-transactions');
      storage.remove('mlue-finance-budgets');
      storage.remove('mlue-finance-categories');
      storage.remove('mlue-finance-accounts');
      storage.remove('mlue-finance-preferences');
      storage.remove('mlue-finance-gemini-api-key');
      storage.remove('mlue-finance-groq-api-key');
      storage.remove('mlue-finance-ai-model');
      storage.remove('mlue-finance-voice-mode');
      // Reload to reflect defaults
      window.location.reload();
    } catch (e) {
      console.error('Reset error', e);
    }
  };

  const exportCsv = () => {
    // Placeholder for future implementation
    alert('Export as CSV is coming soon.');
  };

  // Auto-save on model change
  useEffect(() => {
    if (isInitialLoad) return;
    const currentModel = aiModelStorage.get();
    if (aiModel !== currentModel) {
      aiModelStorage.set(aiModel);
    }
  }, [aiModel, isInitialLoad]);

  // Auto-save on voice mode change
  useEffect(() => {
    if (isInitialLoad) return;
    const currentVoiceMode = voiceModeStorage.get();
    if (voiceMode !== currentVoiceMode) {
      voiceModeStorage.set(voiceMode);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [voiceMode, isInitialLoad]);

  const handleGeminiApiKeySave = () => {
    if (!geminiApiKey.trim()) {
      alert('Please enter an API key');
      return;
    }
    
    // If the key is masked (contains •), don't update
    if (geminiApiKey.includes('•')) {
      alert('API key is already saved. Clear it first to enter a new one.');
      return;
    }
    
    apiKeyStorage.set(geminiApiKey.trim());
    setApiKeySaved(true);
    // Mask the key after saving
    const masked = '•'.repeat(Math.max(0, geminiApiKey.length - 4)) + geminiApiKey.slice(-4);
    setGeminiApiKey(masked);
    setShowGeminiApiKey(false);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleGeminiApiKeyClear = () => {
    if (window.confirm('Are you sure you want to remove your Gemini API key? You will need to add it again to use Gemini AI features.')) {
      apiKeyStorage.remove();
      setGeminiApiKey("");
      setShowGeminiApiKey(false);
    }
  };

  const handleGroqApiKeySave = () => {
    if (!groqApiKey.trim()) {
      alert('Please enter an API key');
      return;
    }
    
    // If the key is masked (contains •), don't update
    if (groqApiKey.includes('•')) {
      alert('API key is already saved. Clear it first to enter a new one.');
      return;
    }
    
    apiKeyStorage.setGroq(groqApiKey.trim());
    setApiKeySaved(true);
    // Mask the key after saving
    const masked = '•'.repeat(Math.max(0, groqApiKey.length - 4)) + groqApiKey.slice(-4);
    setGroqApiKey(masked);
    setShowGroqApiKey(false);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleGroqApiKeyClear = () => {
    if (window.confirm('Are you sure you want to remove your Groq API key? You will need to add it again to use Groq AI features.')) {
      apiKeyStorage.removeGroq();
      setGroqApiKey("");
      setShowGroqApiKey(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient blob - top right */}
      <div
        className="fixed right-0 top-20 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full blur-3xl pointer-events-none z-0 opacity-40 md:opacity-60"
        style={{
          background: 'linear-gradient(to bottom right, rgba(216, 180, 254, 0.4), rgba(91, 33, 182, 0.3), rgba(217, 249, 157, 0.4))'
        }}
        aria-hidden="true"
      />
      {/* Gradient blob - bottom left */}
      <div
        className="fixed bottom-0 left-0 h-[350px] w-[350px] md:h-[600px] md:w-[600px] rounded-full blur-3xl pointer-events-none z-0 opacity-30 md:opacity-50"
        style={{
          background: 'linear-gradient(to top right, rgba(91, 33, 182, 0.3), rgba(216, 180, 254, 0.2), rgba(217, 249, 157, 0.3))'
        }}
        aria-hidden="true"
      />
      {/* Gradient blob - center - hidden on mobile */}
      <div
        className="hidden md:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full blur-3xl pointer-events-none z-0 opacity-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(216, 180, 254, 0.3), rgba(91, 33, 182, 0.25), rgba(217, 249, 157, 0.3))'
        }}
        aria-hidden="true"
      />
      
      <LandingHeader backHref="/dashboard" />

      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and data</p>
        </div>

        <div className="space-y-4">
          {/* AI Model Selection */}
          <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-iris/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-iris" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">AI Model</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose which AI model to use for chat features
                  </p>
                </div>
                <Select value={aiModel} onValueChange={(value: AIModel) => setAiModel(value)}>
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-lg">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini (Google)</SelectItem>
                    <SelectItem value="groq">Groq (Llama 3.1 8B Instant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Gemini API Key */}
          {aiModel === 'gemini' && (
            <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-iris/10 rounded-lg">
                  <Key className="h-5 w-5 text-iris" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Gemini API Key</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add your Google Gemini API key to enable AI chat features
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-iris hover:underline flex items-center space-x-1 mb-3"
                    >
                      <span>Get your API key from Google AI Studio</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showGeminiApiKey ? "text" : "password"}
                        value={geminiApiKey}
                        onChange={(e) => {
                          // Only allow editing if not masked
                          if (!geminiApiKey.includes('•')) {
                            setGeminiApiKey(e.target.value);
                          }
                        }}
                        placeholder="Enter your Gemini API key"
                        className="bg-background/50 border-border/50 rounded-lg flex-1"
                        disabled={geminiApiKey.includes('•')}
                      />
                      {geminiApiKey && !geminiApiKey.includes('•') && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowGeminiApiKey(!showGeminiApiKey)}
                          className="h-10 w-10 p-0"
                        >
                          {showGeminiApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!geminiApiKey.includes('•') && (
                        <Button
                          onClick={handleGeminiApiKeySave}
                          className="rounded-full bg-iris text-white hover:bg-iris/90"
                          disabled={!geminiApiKey.trim()}
                        >
                          Save API Key
                        </Button>
                      )}
                      {geminiApiKey.includes('•') && (
                        <>
                          <Button
                            onClick={() => {
                              setGeminiApiKey("");
                              setShowGeminiApiKey(false);
                            }}
                            variant="outline"
                            className="rounded-full border border-foreground/30 bg-transparent hover:bg-secondary"
                          >
                            Change API Key
                          </Button>
                          <Button
                            onClick={handleGeminiApiKeyClear}
                            variant="outline"
                            className="rounded-full border border-red-500/30 bg-transparent text-red-500 hover:bg-red-500/10"
                          >
                            Remove
                          </Button>
                        </>
                      )}
                      {apiKeySaved && (
                        <div className="flex items-center space-x-2 text-sm text-iris">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Saved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Groq API Key */}
          {aiModel === 'groq' && (
            <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-iris/10 rounded-lg">
                  <Key className="h-5 w-5 text-iris" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Groq API Key</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add your Groq API key to enable AI chat features with Llama 3.1 8B Instant
                    </p>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-iris hover:underline flex items-center space-x-1 mb-3"
                    >
                      <span>Get your API key from Groq Console</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showGroqApiKey ? "text" : "password"}
                        value={groqApiKey}
                        onChange={(e) => {
                          // Only allow editing if not masked
                          if (!groqApiKey.includes('•')) {
                            setGroqApiKey(e.target.value);
                          }
                        }}
                        placeholder="Enter your Groq API key"
                        className="bg-background/50 border-border/50 rounded-lg flex-1"
                        disabled={groqApiKey.includes('•')}
                      />
                      {groqApiKey && !groqApiKey.includes('•') && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowGroqApiKey(!showGroqApiKey)}
                          className="h-10 w-10 p-0"
                        >
                          {showGroqApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!groqApiKey.includes('•') && (
                        <Button
                          onClick={handleGroqApiKeySave}
                          className="rounded-full bg-iris text-white hover:bg-iris/90"
                          disabled={!groqApiKey.trim()}
                        >
                          Save API Key
                        </Button>
                      )}
                      {groqApiKey.includes('•') && (
                        <>
                          <Button
                            onClick={() => {
                              setGroqApiKey("");
                              setShowGroqApiKey(false);
                            }}
                            variant="outline"
                            className="rounded-full border border-foreground/30 bg-transparent hover:bg-secondary"
                          >
                            Change API Key
                          </Button>
                          <Button
                            onClick={handleGroqApiKeyClear}
                            variant="outline"
                            className="rounded-full border border-red-500/30 bg-transparent text-red-500 hover:bg-red-500/10"
                          >
                            Remove
                          </Button>
                        </>
                      )}
                      {apiKeySaved && (
                        <div className="flex items-center space-x-2 text-sm text-iris">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Saved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Voice Mode */}
          <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-iris/10 rounded-lg">
                <Mic className="h-5 w-5 text-iris" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Voice Input Mode</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose how to process voice input: Browser API (free, requires microphone permission) or Groq Whisper (more accurate, requires Groq API key)
                  </p>
                </div>
                <Select 
                  value={voiceMode} 
                  onValueChange={(value: VoiceMode) => {
                    setVoiceMode(value);
                    voiceModeStorage.set(value);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                  }}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-lg">
                    <SelectValue placeholder="Select voice mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="browser">Browser API (Free)</SelectItem>
                    <SelectItem 
                      value="whisper" 
                      disabled={!isWhisperAvailable()}
                    >
                      Groq Whisper {!isWhisperAvailable() && '(Requires Groq API key)'}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {voiceMode === 'whisper' && !isWhisperAvailable() && (
                  <p className="text-xs text-muted-foreground">
                    Please add your Groq API key above to use Whisper voice mode.
                  </p>
                )}
                {voiceMode === 'whisper' && isWhisperAvailable() && (
                  <p className="text-xs text-iris">
                    ✓ Groq Whisper is available. Using more accurate transcription.
                  </p>
                )}
                {saved && (
                  <div className="flex items-center space-x-2 text-sm text-iris">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Currency */}
          <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-iris/10 rounded-lg">
                <Globe className="h-5 w-5 text-iris" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Currency</h3>
                  <p className="text-sm text-muted-foreground">Select your preferred currency for transactions</p>
                </div>
                <Select value={currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-lg">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code} - {c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {saved && (
                  <div className="flex items-center space-x-2 text-sm text-iris">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Export */}
          <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-border transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-iris/10 rounded-lg">
                <Download className="h-5 w-5 text-iris" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Export your transactions as CSV file</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border border-foreground/30 bg-transparent hover:bg-secondary"
                  onClick={exportCsv}
                  disabled
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <p className="text-xs text-muted-foreground italic">Coming soon</p>
              </div>
            </div>
          </Card>

          {/* Reset */}
          <Card className="p-6 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm hover:border-red-500/30 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Reset All Data</h3>
                  <p className="text-sm text-muted-foreground">Clear all local data and return to defaults. This action cannot be undone.</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border border-red-500/30 bg-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
                  onClick={resetAll}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}


