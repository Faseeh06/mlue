"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/finance-utils";
import { FinancialSummary } from "@/lib/types";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

interface FinancialOverviewProps {
  summary: FinancialSummary;
}

export function FinancialOverview({ summary }: FinancialOverviewProps) {
  const { totalIncome, totalExpenses, balance, budgetUtilization } = summary;
  
  const isPositiveBalance = balance >= 0;
  const budgetStatus = budgetUtilization > 100 ? 'over' : budgetUtilization > 80 ? 'warning' : 'good';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm uppercase tracking-widest font-medium">TOTAL INCOME</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif text-foreground">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm uppercase tracking-widest font-medium">TOTAL EXPENSES</CardTitle>
          <TrendingDown className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif text-foreground">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm uppercase tracking-widest font-medium">NET BALANCE</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif text-foreground">
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositiveBalance ? 'Surplus' : 'Deficit'} this month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm uppercase tracking-widest font-medium">BUDGET USAGE</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif text-foreground">{budgetUtilization.toFixed(1)}%</div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge 
              variant={budgetStatus === 'good' ? 'default' : budgetStatus === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {budgetStatus === 'good' ? 'On Track' : budgetStatus === 'warning' ? 'Close' : 'Over Budget'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
