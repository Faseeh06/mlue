"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { AIChat } from "@/components/chat/ai-chat";
import { DashboardToggle } from "@/components/dashboard/dashboard-toggle";
import { Transaction, Category, Budget } from "@/lib/types";
import { transactionStorage, categoryStorage, budgetStorage, storage } from "@/lib/storage";
import { 
  getFinancialSummary, 
  getMonthlySpending,
  calculateBudgetProgress 
} from "@/lib/finance-utils";
import { Plus } from "lucide-react";
import LandingHeader from "@/components/common/landing-header";

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Get view from URL params, default to 'chat'
  const viewParam = searchParams.get('view');
  const [currentView, setCurrentView] = useState<'chat' | 'full'>(
    viewParam === 'full' ? 'full' : 'chat'
  );

  useEffect(() => {
    setMounted(true);
    loadData();
    
    // Update view if URL param changes
    if (viewParam === 'full') {
      setCurrentView('full');
    } else if (viewParam === 'chat') {
      setCurrentView('chat');
    }

    // Listen for storage changes (sync across tabs)
    const unsubscribe = storage.onStorageChange((key) => {
      if (key.startsWith('mlue-finance-')) {
        loadData();
      }
    });

    // Refresh on focus
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [viewParam]);

  const loadData = () => {
    setTransactions(transactionStorage.getAll());
    setCategories(categoryStorage.getAll());
    setBudgets(budgetStorage.getAll());
  };

  const handleTransactionFromAI = (transaction: Transaction) => {
    // Transaction is already saved by AI chat, just reload data
    loadData();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // Store current view state
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('transaction-referrer', window.location.href);
    }
    router.push(`/transaction?id=${transaction.id}`);
  };

  const handleAddTransaction = () => {
    // Store current view state
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('transaction-referrer', window.location.href);
    }
    router.push('/transaction');
  };

  const handleDeleteTransaction = (id: string) => {
    transactionStorage.delete(id);
    loadData();
  };

  const handleAddBudget = () => {
    // Store current view state and referrer
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('budget-referrer', window.location.href);
    }
    router.push('/budget');
  };
  
  const handleViewChange = (view: 'chat' | 'full') => {
    setCurrentView(view);
    // Update URL without page reload
    const newUrl = view === 'full' ? '/dashboard?view=full' : '/dashboard';
    window.history.replaceState({}, '', newUrl);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iris"></div>
      </div>
    );
  }

  const financialSummary = getFinancialSummary(transactions);
  const monthlySpending = getMonthlySpending(transactions);
  const budgetProgress = calculateBudgetProgress(budgets, transactions);

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Header (reused from landing) */}
      <LandingHeader backHref="/" />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-6 overflow-hidden flex flex-col relative">
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
        
        <div className="relative flex-1 flex flex-col overflow-hidden z-10">
          {/* Dashboard Toggle */}
          <div className="flex-shrink-0 mb-4">
            <DashboardToggle 
              currentView={currentView} 
              onViewChange={handleViewChange}
            />
          </div>

          {/* Debug Test removed */}

          {/* Conditional Content */}
          {currentView === 'chat' ? (
            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
              <AIChat onTransactionAdded={handleTransactionFromAI} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 sm:space-y-6">
              {/* Financial Overview */}
              <FinancialOverview summary={financialSummary} />

              {/* Charts and Lists */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <SpendingChart data={monthlySpending} />
                <BudgetProgress budgets={budgetProgress} onAddBudget={handleAddBudget} />
              </div>

              {/* Recent Transactions */}
              <RecentTransactions 
                transactions={transactions} 
                onAddTransaction={handleAddTransaction} 
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                initialLimit={5}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Add Button */}
      {currentView === 'full' && (
        <Link href="/transaction" className="fixed bottom-6 right-6 sm:hidden z-[100]">
          <Button 
            size="lg"
            className="rounded-full shadow-lg bg-iris text-white hover:bg-iris/90 h-12 w-12 p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iris"></div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
