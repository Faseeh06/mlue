import { Transaction, Budget, Category, Account, Preferences } from './types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'mlue-finance-transactions',
  BUDGETS: 'mlue-finance-budgets',
  CATEGORIES: 'mlue-finance-categories',
  ACCOUNTS: 'mlue-finance-accounts',
  PREFS: 'mlue-finance-preferences',
  GEMINI_API_KEY: 'mlue-finance-gemini-api-key',
  GROQ_API_KEY: 'mlue-finance-groq-api-key',
  AI_MODEL: 'mlue-finance-ai-model',
  VOICE_MODE: 'mlue-finance-voice-mode',
  THEME: 'mlue-finance-theme',
};

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#ef4444', icon: '🍽️', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#3b82f6', icon: '🚗', type: 'expense' },
  { id: '3', name: 'Shopping', color: '#8b5cf6', icon: '🛍️', type: 'expense' },
  { id: '4', name: 'Entertainment', color: '#f59e0b', icon: '🎬', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', color: '#6b7280', icon: '⚡', type: 'expense' },
  { id: '6', name: 'Healthcare', color: '#10b981', icon: '🏥', type: 'expense' },
  { id: '7', name: 'Education', color: '#06b6d4', icon: '📚', type: 'expense' },
  { id: '8', name: 'Salary', color: '#22c55e', icon: '💰', type: 'income' },
  { id: '9', name: 'Freelance', color: '#84cc16', icon: '💻', type: 'income' },
  { id: '10', name: 'Investment', color: '#eab308', icon: '📈', type: 'income' },
];

// Storage utility functions with improved error handling and persistence
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      // Try to recover from corrupted data
      try {
        localStorage.removeItem(key);
      } catch {}
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      
      // Verify the write was successful
      const verification = localStorage.getItem(key);
      if (verification === null) {
        throw new Error('Write verification failed');
      }
      
      return true;
    } catch (error: any) {
      // Handle quota exceeded error
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error(`Storage quota exceeded for key "${key}". Attempting cleanup...`);
        // Try to free up space by removing old chat data
        try {
          const chatKey = 'mlue-finance-chat';
          const chatData = localStorage.getItem(chatKey);
          if (chatData) {
            const chatMessages = JSON.parse(chatData);
            // Keep only last 50 messages
            if (Array.isArray(chatMessages) && chatMessages.length > 50) {
              localStorage.setItem(chatKey, JSON.stringify(chatMessages.slice(-50)));
              // Retry the original write
              try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
              } catch (retryError) {
                console.error(`Retry after cleanup failed:`, retryError);
              }
            }
          }
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
        
        // Show user-friendly error
        if (typeof window !== 'undefined') {
          alert('Storage is full. Please clear some data or export your data to free up space.');
        }
      } else {
        console.error(`Error writing to localStorage for key "${key}":`, error);
      }
      return false;
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  },

  // Listen for storage changes across tabs
  onStorageChange: (callback: (key: string, newValue: any) => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('mlue-finance-')) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          callback(e.key, newValue);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  },
};

// Transaction operations
export const transactionStorage = {
  getAll: (): Transaction[] => storage.get(STORAGE_KEYS.TRANSACTIONS, []),
  get: (id: string): Transaction | undefined => {
    const transactions = transactionStorage.getAll();
    return transactions.find(t => t.id === id);
  },
  save: (transactions: Transaction[]): boolean => {
    return storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  },
  add: (transaction: Transaction): boolean => {
    const transactions = transactionStorage.getAll();
    transactions.push(transaction);
    return transactionStorage.save(transactions);
  },
  update: (id: string, updatedTransaction: Partial<Transaction>): boolean => {
    const transactions = transactionStorage.getAll();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      return transactionStorage.save(transactions);
    }
    return false;
  },
  delete: (id: string): boolean => {
    const transactions = transactionStorage.getAll().filter(t => t.id !== id);
    return transactionStorage.save(transactions);
  },
};

// Budget operations
export const budgetStorage = {
  getAll: (): Budget[] => storage.get(STORAGE_KEYS.BUDGETS, []),
  get: (id: string): Budget | undefined => {
    const budgets = budgetStorage.getAll();
    return budgets.find(b => b.id === id);
  },
  save: (budgets: Budget[]): boolean => {
    return storage.set(STORAGE_KEYS.BUDGETS, budgets);
  },
  add: (budget: Budget): boolean => {
    const budgets = budgetStorage.getAll();
    budgets.push(budget);
    return budgetStorage.save(budgets);
  },
  update: (id: string, updatedBudget: Partial<Budget>): boolean => {
    const budgets = budgetStorage.getAll();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updatedBudget };
      return budgetStorage.save(budgets);
    }
    return false;
  },
  delete: (id: string): boolean => {
    const budgets = budgetStorage.getAll().filter(b => b.id !== id);
    return budgetStorage.save(budgets);
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

// AI Model preference
export type AIModel = 'gemini' | 'groq';

export const aiModelStorage = {
  get: (): AIModel => {
    return storage.get<AIModel>(STORAGE_KEYS.AI_MODEL, 'gemini');
  },
  set: (model: AIModel): boolean => {
    return storage.set(STORAGE_KEYS.AI_MODEL, model);
  },
};

// API Key operations (unified for both models)
export const apiKeyStorage = {
  // Gemini API Key
  get: (): string | null => {
    const key = storage.get<string | null>(STORAGE_KEYS.GEMINI_API_KEY, null);
    return key || null;
  },
  set: (key: string): boolean => {
    return storage.set(STORAGE_KEYS.GEMINI_API_KEY, key);
  },
  remove: (): void => {
    storage.remove(STORAGE_KEYS.GEMINI_API_KEY);
  },
  has: (): boolean => {
    const key = apiKeyStorage.get();
    return key !== null && key.trim().length > 0;
  },
  
  // Groq API Key
  getGroq: (): string | null => {
    const key = storage.get<string | null>(STORAGE_KEYS.GROQ_API_KEY, null);
    return key || null;
  },
  setGroq: (key: string): boolean => {
    return storage.set(STORAGE_KEYS.GROQ_API_KEY, key);
  },
  removeGroq: (): void => {
    storage.remove(STORAGE_KEYS.GROQ_API_KEY);
  },
  hasGroq: (): boolean => {
    const key = apiKeyStorage.getGroq();
    return key !== null && key.trim().length > 0;
  },
  
  // Get API key for current model
  getForModel: (model: AIModel): string | null => {
    return model === 'groq' ? apiKeyStorage.getGroq() : apiKeyStorage.get();
  },
  
  // Check if API key exists for current model
  hasForModel: (model: AIModel): boolean => {
    return model === 'groq' ? apiKeyStorage.hasGroq() : apiKeyStorage.has();
  },
};

// Voice Mode preference
export type VoiceMode = 'browser' | 'whisper';

export const voiceModeStorage = {
  get: (): VoiceMode => {
    return storage.get<VoiceMode>(STORAGE_KEYS.VOICE_MODE, 'browser');
  },
  set: (mode: VoiceMode): boolean => {
    return storage.set(STORAGE_KEYS.VOICE_MODE, mode);
  },
};

// Theme preference
export type ThemeColor = 'purple' | 'orange' | 'blue' | 'green' | 'teal' | 'pink' | 'indigo' | 'red' | 'cyan';

export const themeStorage = {
  get: (): ThemeColor => {
    return storage.get<ThemeColor>(STORAGE_KEYS.THEME, 'purple');
  },
  set: (theme: ThemeColor): boolean => {
    return storage.set(STORAGE_KEYS.THEME, theme);
  },
};
