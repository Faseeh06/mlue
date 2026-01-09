"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Transaction, Category } from "@/lib/types";
import { generateId } from "@/lib/finance-utils";
import { transactionStorage, categoryStorage } from "@/lib/storage";
import LandingHeader from "@/components/common/landing-header";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id');
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setMounted(true);
    
    // Store referrer when navigating to transaction page
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      if (!currentUrl.includes('transaction')) {
        sessionStorage.setItem('transaction-referrer', currentUrl);
      }
    }
    
    const allCategories = categoryStorage.getAll();
    setCategories(allCategories);

    // Load transaction if editing
    if (transactionId) {
      const transaction = transactionStorage.get(transactionId);
      if (transaction) {
        setEditingTransaction(transaction);
        setFormData({
          amount: transaction.amount.toString(),
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          date: transaction.date,
        });
      }
    }
  }, [transactionId]);

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      return;
    }

    if (editingTransaction) {
      // Update existing transaction
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date,
      };
      transactionStorage.update(editingTransaction.id, updatedTransaction);
    } else {
      // Create new transaction
      const newTransaction: Transaction = {
        id: generateId(),
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date,
      };
      transactionStorage.add(newTransaction);
    }

    // Navigate to dashboard with charts view after saving
    router.push('/dashboard?view=full');
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '', // Reset category when type changes
    }));
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl relative z-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-2">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {editingTransaction ? 'Update your transaction details' : 'Record a new income or expense'}
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-4 sm:p-6 md:p-8 bg-transparent border border-border/50 rounded-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Transaction Type */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm sm:text-base font-medium">Transaction Type</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={handleTypeChange}
                className="flex space-x-4 sm:space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="font-normal cursor-pointer">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="font-normal cursor-pointer">Income</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm sm:text-base font-medium">Amount</Label>
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="bg-background/50 border-border/50 rounded-lg min-h-[100px] text-base"
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
                  {filteredCategories.map((category) => (
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

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm sm:text-base font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="bg-background/50 border-border/50 rounded-lg h-11 text-base"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const referrer = typeof window !== 'undefined' ? sessionStorage.getItem('transaction-referrer') : null;
                  if (referrer && referrer.includes('/dashboard')) {
                    router.push('/dashboard?view=full');
                  } else if (referrer && !referrer.includes('/transaction')) {
                    router.push(referrer);
                  } else {
                    router.push('/dashboard?view=full');
                  }
                }}
                className="flex-1 rounded-full border border-foreground/30 bg-transparent hover:bg-secondary h-12"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 rounded-full bg-iris text-white hover:bg-iris/90 h-12"
              >
                {editingTransaction ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Update Transaction
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

