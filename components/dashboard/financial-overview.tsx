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
      <Card className="bg-transparent border border-gray-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-light tracking-tight">TOTAL INCOME</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-light bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-gray-600 font-light">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-transparent border border-gray-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-light tracking-tight">TOTAL EXPENSES</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-light bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-gray-600 font-light">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-transparent border border-gray-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-light tracking-tight">NET BALANCE</CardTitle>
          <DollarSign className={`h-4 w-4 ${isPositiveBalance ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-light ${isPositiveBalance ? 'bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-gray-600 font-light">
            {isPositiveBalance ? 'Surplus' : 'Deficit'} this month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-transparent border border-gray-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-light tracking-tight">BUDGET USAGE</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-light bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{budgetUtilization.toFixed(1)}%</div>
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
