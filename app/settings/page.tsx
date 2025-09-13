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
    <div className="min-h-screen bg-[#f8f8f8]">
      <LandingHeader backHref="/dashboard" />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Currency */}
        <Card className="p-6 bg-transparent border border-gray-200/50 max-w-xl">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-light mb-2">Currency</div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
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
              <Button onClick={save} className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0">
                Save
              </Button>
            </div>
          </div>
        </Card>

        {/* Export */}
        <Card className="p-6 bg-transparent border border-gray-200/50 max-w-xl">
          <div className="space-y-3">
            <div className="text-sm font-light">Export Data</div>
            <p className="text-sm text-gray-600 font-light">Export your transactions as CSV. Coming soon.</p>
            <Button
              variant="outline"
              className="border-2 w-fit"
              onClick={exportCsv}
              disabled
              title="Export as CSV (coming soon)"
            >
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Reset */}
        <Card className="p-6 bg-transparent border border-gray-200/50 max-w-xl">
          <div className="space-y-3">
            <div className="text-sm font-light">Reset the whole app</div>
            <p className="text-sm text-gray-600 font-light">Clear all local data and return to defaults. This cannot be undone.</p>
            <Button
              variant="outline"
              className="border-2 w-fit"
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


