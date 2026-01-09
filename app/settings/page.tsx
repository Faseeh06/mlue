"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { preferencesStorage, storage } from "@/lib/storage";
import LandingHeader from "@/components/common/landing-header";
import { DollarSign, Download, Trash2, CheckCircle2, Globe } from "lucide-react";

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
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = preferencesStorage.get();
    setCurrency(prefs.currency || "USD");
  }, []);

  // Auto-save on currency change
  useEffect(() => {
    if (currency) {
      const prefs = preferencesStorage.get();
      const currentCurrency = prefs.currency || "USD";
      if (currency !== currentCurrency) {
        preferencesStorage.set({ ...prefs, currency });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }
  }, [currency]);

  const resetAll = () => {
    const ok = window.confirm('This will delete all local data (transactions, budgets, categories, accounts, settings). Continue?');
    if (!ok) return;
    // Known keys used by the app
    try {
      storage.remove('mlue-finance-transactions');
      storage.remove('mlue-finance-budgets');
      storage.remove('mlue-finance-categories');
      storage.remove('mlue-finance-accounts');
      storage.remove('mlue-finance-preferences');
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
                <Select value={currency} onValueChange={setCurrency}>
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


