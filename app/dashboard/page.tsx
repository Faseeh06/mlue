"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { TransactionForm } from "@/components/forms/transaction-form";
import { AIChat } from "@/components/chat/ai-chat";
import { DashboardToggle } from "@/components/dashboard/dashboard-toggle";
import { Transaction, Category, Budget } from "@/lib/types";
import { transactionStorage, categoryStorage, budgetStorage } from "@/lib/storage";
import { 
  getFinancialSummary, 
  getMonthlySpending,
  calculateBudgetProgress 
} from "@/lib/finance-utils";
import { Wallet, Plus, Settings, Menu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LandingHeader from "@/components/common/landing-header";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'full'>('chat');

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(transactionStorage.getAll());
    setCategories(categoryStorage.getAll());
    setBudgets(budgetStorage.getAll());
  };

  const handleAddTransaction = (transaction: Transaction) => {
    // Create new transaction
    transactionStorage.add(transaction);
    loadData();
  };

  const handleSubmitTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      // Update existing
      transactionStorage.update(transaction.id, transaction);
    } else {
      transactionStorage.add(transaction);
    }
    setEditingTransaction(undefined);
    loadData();
  };

  const handleTransactionFromAI = (transaction: Transaction) => {
    // Transaction is already saved by AI chat, just reload data
    loadData();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    transactionStorage.delete(id);
    loadData();
  };

  const handleAddBudget = () => {
    // TODO: Implement budget form
    console.log('Add budget clicked');
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
      <main className="flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col relative">
        {/* Gradient blob - top right */}
        <div
          className="fixed right-0 top-20 h-[400px] w-[400px] rounded-full blur-3xl pointer-events-none z-0 opacity-40"
          style={{
            background: 'linear-gradient(to bottom right, rgba(216, 180, 254, 0.3), rgba(91, 33, 182, 0.2), rgba(217, 249, 157, 0.3))'
          }}
          aria-hidden="true"
        />
        {/* Gradient blob - bottom left */}
        <div
          className="fixed bottom-0 left-0 h-[500px] w-[500px] rounded-full blur-3xl pointer-events-none z-0 opacity-30"
          style={{
            background: 'linear-gradient(to top right, rgba(91, 33, 182, 0.25), rgba(216, 180, 254, 0.15), rgba(217, 249, 157, 0.2))'
          }}
          aria-hidden="true"
        />
        
        <div className="relative flex-1 flex flex-col overflow-hidden z-10">
          {/* Dashboard Toggle */}
          <div className="flex-shrink-0 mb-4">
            <DashboardToggle 
              currentView={currentView} 
              onViewChange={setCurrentView}
            />
          </div>

          {/* Debug Test removed */}

          {/* Conditional Content */}
          {currentView === 'chat' ? (
            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
              <AIChat onTransactionAdded={handleTransactionFromAI} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
              {/* Financial Overview */}
              <FinancialOverview summary={financialSummary} />

              {/* Charts and Lists */}
              <div className="grid gap-6 lg:grid-cols-3">
                <SpendingChart data={monthlySpending} />
                <BudgetProgress budgets={budgetProgress} onAddBudget={handleAddBudget} />
              </div>

              {/* Recent Transactions */}
              <RecentTransactions 
                transactions={transactions} 
                onAddTransaction={() => { setEditingTransaction(undefined); setShowTransactionForm(true); }} 
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                initialLimit={5}
              />
            </div>
          )}
        </div>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={showTransactionForm}
        onOpenChange={(open) => { setShowTransactionForm(open); if (!open) setEditingTransaction(undefined); }}
        onSubmit={handleSubmitTransaction}
        categories={categories}
        transaction={editingTransaction}
      />

      {/* Mobile Add Button */}
      {currentView === 'full' && (
        <div className="fixed bottom-6 right-6 sm:hidden">
          <Button 
            onClick={() => setShowTransactionForm(true)}
            size="lg"
            className="rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
