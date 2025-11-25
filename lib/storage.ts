import { Transaction, Budget, Category, Account, Preferences } from './types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'mlue-finance-transactions',
  BUDGETS: 'mlue-finance-budgets',
  CATEGORIES: 'mlue-finance-categories',
  ACCOUNTS: 'mlue-finance-accounts',
  PREFS: 'mlue-finance-preferences',
};

// Default categories for business transactions
export const DEFAULT_CATEGORIES: Category[] = [
  // Expense/Payment categories
  { id: '1', name: 'Inventory Purchase', color: '#ef4444', icon: '📦', type: 'expense' },
  { id: '2', name: 'Supplier Payment', color: '#3b82f6', icon: '🏭', type: 'expense' },
  { id: '3', name: 'Equipment Purchase', color: '#8b5cf6', icon: '🔧', type: 'expense' },
  { id: '4', name: 'Operating Expenses', color: '#f59e0b', icon: '💼', type: 'expense' },
  { id: '5', name: 'Utility Bills', color: '#6b7280', icon: '⚡', type: 'expense' },
  { id: '6', name: 'Salaries/Wages', color: '#10b981', icon: '👥', type: 'expense' },
  { id: '7', name: 'Professional Services', color: '#06b6d4', icon: '🎓', type: 'expense' },
  { id: '8', name: 'Rent/Lease', color: '#ec4899', icon: '🏢', type: 'expense' },
  // Income/Receipt categories
  { id: '9', name: 'Sales/Revenue', color: '#22c55e', icon: '💰', type: 'income' },
  { id: '10', name: 'Client Payment', color: '#84cc16', icon: '💳', type: 'income' },
  { id: '11', name: 'Service Income', color: '#eab308', icon: '🛠️', type: 'income' },
  { id: '12', name: 'Other Income', color: '#14b8a6', icon: '📈', type: 'income' },
];

// Storage utility functions
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  },
};

// Transaction operations
export const transactionStorage = {
  getAll: (): Transaction[] => storage.get(STORAGE_KEYS.TRANSACTIONS, []),
  save: (transactions: Transaction[]) => storage.set(STORAGE_KEYS.TRANSACTIONS, transactions),
  add: (transaction: Transaction) => {
    const transactions = transactionStorage.getAll();
    transactions.push(transaction);
    transactionStorage.save(transactions);
  },
  update: (id: string, updatedTransaction: Partial<Transaction>) => {
    const transactions = transactionStorage.getAll();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      transactionStorage.save(transactions);
    }
  },
  delete: (id: string) => {
    const transactions = transactionStorage.getAll().filter(t => t.id !== id);
    transactionStorage.save(transactions);
  },
};

// Budget operations
export const budgetStorage = {
  getAll: (): Budget[] => storage.get(STORAGE_KEYS.BUDGETS, []),
  save: (budgets: Budget[]) => storage.set(STORAGE_KEYS.BUDGETS, budgets),
  add: (budget: Budget) => {
    const budgets = budgetStorage.getAll();
    budgets.push(budget);
    budgetStorage.save(budgets);
  },
  update: (id: string, updatedBudget: Partial<Budget>) => {
    const budgets = budgetStorage.getAll();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updatedBudget };
      budgetStorage.save(budgets);
    }
  },
  delete: (id: string) => {
    const budgets = budgetStorage.getAll().filter(b => b.id !== id);
    budgetStorage.save(budgets);
  },
};

// Category operations
export const categoryStorage = {
  getAll: (): Category[] => {
    const categories = storage.get(STORAGE_KEYS.CATEGORIES, []);
    return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  },
  save: (categories: Category[]) => storage.set(STORAGE_KEYS.CATEGORIES, categories),
  add: (category: Category) => {
    const categories = categoryStorage.getAll();
    categories.push(category);
    categoryStorage.save(categories);
  },
  update: (id: string, updatedCategory: Partial<Category>) => {
    const categories = categoryStorage.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedCategory };
      categoryStorage.save(categories);
    }
  },
  delete: (id: string) => {
    const categories = categoryStorage.getAll().filter(c => c.id !== id);
    categoryStorage.save(categories);
  },
};

// Account operations
export const accountStorage = {
  getAll: (): Account[] => storage.get(STORAGE_KEYS.ACCOUNTS, []),
  save: (accounts: Account[]) => storage.set(STORAGE_KEYS.ACCOUNTS, accounts),
  add: (account: Account) => {
    const accounts = accountStorage.getAll();
    accounts.push(account);
    accountStorage.save(accounts);
  },
  update: (id: string, updatedAccount: Partial<Account>) => {
    const accounts = accountStorage.getAll();
    const index = accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updatedAccount };
      accountStorage.save(accounts);
    }
  },
  delete: (id: string) => {
    const accounts = accountStorage.getAll().filter(a => a.id !== id);
    accountStorage.save(accounts);
  },
};

// Preferences operations
export const preferencesStorage = {
  get: (): Preferences => storage.get(STORAGE_KEYS.PREFS, { currency: 'USD', locale: 'en-US' }),
  set: (prefs: Preferences) => storage.set(STORAGE_KEYS.PREFS, prefs),
};
