"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Budget, Category } from "@/lib/types";
import { generateId } from "@/lib/finance-utils";
import { budgetStorage, categoryStorage, storage } from "@/lib/storage";
import LandingHeader from "@/components/common/landing-header";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

function BudgetPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetId = searchParams.get('id');
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    setMounted(true);
    
    // Store referrer when navigating to budget page
    if (typeof window !== 'undefined') {
      const storedReferrer = sessionStorage.getItem('budget-referrer');
      if (storedReferrer) {
        setReferrer(storedReferrer);
        sessionStorage.removeItem('budget-referrer'); // Clear after reading
      } else {
        // Fallback to document.referrer or dashboard
        setReferrer(document.referrer || '/dashboard?view=full');
      }
    }
    
    const loadData = () => {
      const allCategories = categoryStorage.getAll();
      setCategories(allCategories);
      setBudgets(budgetStorage.getAll());
    };
    
    loadData();

    // Load budget if editing
    if (budgetId) {
      const budget = budgetStorage.get(budgetId);
      if (budget) {
        setEditingBudget(budget);
        setFormData({
          name: budget.name,
          amount: budget.amount.toString(),
          category: budget.category,
          period: budget.period,
          startDate: budget.startDate,
          endDate: budget.endDate,
        });
      }
    } else {
      // Set default end date for new budget (1 month from start)
      const defaultEndDate = new Date();
      defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
      setFormData(prev => ({
        ...prev,
        endDate: defaultEndDate.toISOString().split('T')[0],
      }));
    }

    // Listen for storage changes (sync across tabs)
    const unsubscribe = storage.onStorageChange((key, newValue) => {
      if (key === 'mlue-finance-budgets') {
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
  }, [budgetId]);

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const calculateEndDate = (startDate: string, period: 'monthly' | 'weekly' | 'yearly') => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    switch (period) {
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }
    
    return end.toISOString().split('T')[0];
  };

  const handlePeriodChange = (period: 'monthly' | 'weekly' | 'yearly') => {
    const endDate = calculateEndDate(formData.startDate, period);
    setFormData(prev => ({
      ...prev,
      period,
      endDate,
    }));
  };

  const handleStartDateChange = (startDate: string) => {
    const endDate = calculateEndDate(startDate, formData.period);
    setFormData(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.category || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (editingBudget) {
      // Update existing budget - navigate to dashboard with charts view
      const updatedBudget: Budget = {
        ...editingBudget,
        name: formData.name,
        amount,
        category: formData.category,
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };
      budgetStorage.update(editingBudget.id, updatedBudget);
      setBudgets(budgetStorage.getAll());
      // Navigate to dashboard with charts view
      router.push('/dashboard?view=full');
    } else {
      // Create new budget
      const newBudget: Budget = {
        id: generateId(),
        name: formData.name,
        amount,
        spent: 0,
        category: formData.category,
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };
      budgetStorage.add(newBudget);
      setBudgets(budgetStorage.getAll());
      
      // Navigate back to referrer if coming from dashboard, otherwise stay on budget page
      if (referrer && referrer.includes('/dashboard')) {
        // If coming from dashboard, go back to dashboard with charts view
        router.push('/dashboard?view=full');
      } else if (referrer && !referrer.includes('/budget') && !referrer.includes('/transaction')) {
        // If coming from another page (not budget or transaction), go back there
        router.push(referrer);
      } else {
        // Default: stay on budget page and reset form (user is already on budget page)
        setFormData({
          name: '',
          amount: '',
          category: '',
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          endDate: calculateEndDate(new Date().toISOString().split('T')[0], 'monthly'),
        });
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      budgetStorage.delete(id);
      setBudgets(budgetStorage.getAll());
      if (editingBudget?.id === id) {
        // Navigate back to referrer or dashboard
        if (referrer && referrer.includes('/dashboard')) {
          router.push('/dashboard?view=full');
        } else if (referrer && !referrer.includes('/budget')) {
          router.push(referrer);
        } else {
          router.push('/budget');
        }
      }
    }
  };

  const handleEdit = (budget: Budget) => {
    // Store current page as referrer when editing
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('budget-referrer', window.location.href);
    }
    router.push(`/budget?id=${budget.id}`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iris"></div>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl relative z-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-2">
            {editingBudget ? 'Edit Budget' : 'Manage Budgets'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {editingBudget ? 'Update your budget details' : 'Create and manage your spending budgets'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Budget Form */}
          <Card className="p-4 sm:p-6 md:p-8 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Budget Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base font-medium">Budget Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Groceries, Entertainment"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-background/50 border-border/50 rounded-lg h-11 text-base"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm sm:text-base font-medium">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  className="bg-background/50 border-border/50 rounded-lg h-11 text-base"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm sm:text-base font-medium">Category</Label>
                <Select value={formData.category} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-lg h-11">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period */}
              <div className="space-y-2">
                <Label htmlFor="period" className="text-sm sm:text-base font-medium">Period</Label>
                <Select value={formData.period} onValueChange={(value: 'monthly' | 'weekly' | 'yearly') => 
                  handlePeriodChange(value)
                }>
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-lg h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm sm:text-base font-medium">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 rounded-lg h-11 text-base"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm sm:text-base font-medium">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                  className="bg-background/50 border-border/50 rounded-lg h-11 text-base"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                {editingBudget && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDelete(editingBudget.id)}
                    className="flex-1 rounded-full h-12"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (referrer && referrer.includes('/dashboard')) {
                      router.push('/dashboard?view=full');
                    } else if (referrer && !referrer.includes('/budget')) {
                      router.push(referrer);
                    } else {
                      router.push('/budget');
                    }
                  }}
                  className={editingBudget ? "flex-1 rounded-full border border-foreground/30 bg-transparent hover:bg-secondary h-12" : "hidden"}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 rounded-full bg-iris text-white hover:bg-iris/90 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Budget List */}
          <Card className="p-4 sm:p-6 md:p-8 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>
            {budgets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No budgets created yet</p>
                <p className="text-sm text-muted-foreground">Create your first budget to start tracking your spending</p>
              </div>
            ) : (
              <div className="space-y-3">
                {budgets.map((budget) => {
                  const category = categories.find(c => c.name === budget.category);
                  return (
                    <div
                      key={budget.id}
                      className="p-4 border border-border/50 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {category && <span className="text-lg">{category.icon}</span>}
                            <h3 className="font-semibold">{budget.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{budget.category}</p>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">${budget.amount.toFixed(2)} / {budget.period}</p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                            className="rounded-full"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(budget.id)}
                            className="rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function BudgetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iris"></div>
      </div>
    }>
      <BudgetPageContent />
    </Suspense>
  );
}

