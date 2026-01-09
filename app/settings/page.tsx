"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { preferencesStorage, storage } from "@/lib/storage";
import LandingHeader from "@/components/common/landing-header";

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

  useEffect(() => {
    const prefs = preferencesStorage.get();
    setCurrency(prefs.currency || "USD");
  }, []);

  const save = () => {
    const prefs = preferencesStorage.get();
    preferencesStorage.set({ ...prefs, currency });
  };

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
      {/* Gradient blob */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-l blur-3xl rounded-full opacity-30"
          style={{
            background: 'linear-gradient(to left, rgba(216, 180, 254, 0.25), rgba(91, 33, 182, 0.15), transparent)'
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
          style={{
            background: 'linear-gradient(to top right, rgba(91, 33, 182, 0.2), rgba(216, 180, 254, 0.15), rgba(217, 249, 157, 0.2))'
          }}
        />
      </div>
      
      <LandingHeader backHref="/dashboard" />

      <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Currency */}
        <Card className="p-6 bg-secondary border border-border max-w-xl rounded-xl">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-light mb-2 text-foreground">Currency</div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} - {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button onClick={save} variant="default">
                Save
              </Button>
            </div>
          </div>
        </Card>

        {/* Export */}
        <Card className="p-6 bg-secondary border border-border max-w-xl rounded-xl">
          <div className="space-y-3">
            <div className="text-sm font-light text-foreground">Export Data</div>
            <p className="text-sm text-muted-foreground font-light">Export your transactions as CSV. Coming soon.</p>
            <Button
              variant="outline"
              className="w-fit"
              onClick={exportCsv}
              disabled
              title="Export as CSV (coming soon)"
            >
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Reset */}
        <Card className="p-6 bg-secondary border border-border max-w-xl rounded-xl">
          <div className="space-y-3">
            <div className="text-sm font-light text-foreground">Reset the whole app</div>
            <p className="text-sm text-muted-foreground font-light">Clear all local data and return to defaults. This cannot be undone.</p>
            <Button
              variant="outline"
              className="w-fit"
              onClick={resetAll}
              title="Reset all local data"
            >
              Reset All
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}


