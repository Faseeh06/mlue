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
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const financialSummary = getFinancialSummary(transactions);
  const monthlySpending = getMonthlySpending(transactions);
  const budgetProgress = calculateBudgetProgress(budgets, transactions);

  return (
    <div className="min-h-screen bg-[#f8f8f8] overflow-hidden">
      {/* Header (reused from landing) */}
      <LandingHeader backHref="/" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 overflow-y-auto scrollbar-hide">
        {/* Gradient blob */}
        <div
          className="fixed right-0 top-20 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 opacity-30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        
        <div className="relative space-y-6">
          {/* Dashboard Toggle */}
          <DashboardToggle 
            currentView={currentView} 
            onViewChange={setCurrentView}
          />

          {/* Debug Test removed */}

          {/* Conditional Content */}
          {currentView === 'chat' ? (
            <div className="max-w-4xl mx-auto">
              <AIChat onTransactionAdded={handleTransactionFromAI} />
            </div>
          ) : (
            <>
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
            </>
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
            className="rounded-full shadow-lg bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
