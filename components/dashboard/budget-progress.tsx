"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Budget } from "@/lib/types";
import { formatCurrency } from "@/lib/finance-utils";
import { Plus, AlertTriangle } from "lucide-react";

interface BudgetProgressProps {
  budgets: Array<Budget & {
    spent: number;
    remaining: number;
    percentage: number;
    isOverBudget: boolean;
  }>;
  onAddBudget: () => void;
}

export function BudgetProgress({ budgets, onAddBudget }: BudgetProgressProps) {
  return (
    <Card className="col-span-full lg:col-span-1 bg-secondary">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="uppercase tracking-widest font-medium text-sm">BUDGET PROGRESS</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">Track your spending limits</CardDescription>
        </div>
        <Button 
          onClick={onAddBudget} 
          size="sm" 
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No budgets set</p>
            <Button 
              onClick={onAddBudget} 
              variant="outline" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground">{budget.category}</span>
                    {budget.isOverBudget && (
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <Badge 
                    variant={
                      budget.isOverBudget 
                        ? "destructive" 
                        : budget.percentage > 80 
                        ? "secondary" 
                        : "default"
                    }
                  >
                    {budget.percentage.toFixed(0)}%
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spent: {formatCurrency(budget.spent)}</span>
                  <span>Budget: {formatCurrency(budget.amount)}</span>
                </div>
                {budget.isOverBudget && (
                  <p className="text-xs text-primary">
                    Over budget by {formatCurrency(budget.spent - budget.amount)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
