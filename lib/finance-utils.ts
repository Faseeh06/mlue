import { Transaction, Budget, FinancialSummary } from './types';
import { transactionStorage, budgetStorage, preferencesStorage } from './storage';

export function formatCurrency(amount: number): string {
  const prefs = preferencesStorage.get();
  const locale = prefs.locale || 'en-US';
  const currency = prefs.currency || 'USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function getFinancialSummary(transactions: Transaction[]): FinancialSummary {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate budget utilization
  const budgets = budgetStorage.getAll();
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    balance,
    budgetUtilization,
  };
}

export function getTransactionsByCategory(transactions: Transaction[]) {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
}

export function getRecentTransactions(transactions: Transaction[], limit = 5): Transaction[] {
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getMonthlySpending(transactions: Transaction[], months = 6) {
  const monthlyData = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === date.getMonth() && 
             transactionDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month,
      income,
      expenses,
      net: income - expenses,
    });
  }

  return monthlyData;
}

export function calculateBudgetProgress(budgets: Budget[], transactions: Transaction[]) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return budgets.map(budget => {
    const categoryTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.category === budget.category &&
             t.type === 'expense' &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

    return {
      ...budget,
      spent,
      remaining,
      percentage,
      isOverBudget: spent > budget.amount,
    };
  });
}
