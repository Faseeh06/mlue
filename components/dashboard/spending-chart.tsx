"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { getCurrentTheme, getThemeColors } from "@/lib/theme";

interface SpendingChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  const { theme, irisRgb, lilacRgb } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="col-span-full lg:col-span-2 bg-secondary">
      <CardHeader>
        <CardTitle className="uppercase tracking-widest font-medium text-sm">MONTHLY OVERVIEW</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-1">Income vs Expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`incomeGradient-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.irisHex} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={themeColors.irisHex} stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id={`expensesGradient-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.lilacHex} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={themeColors.lilacHex} stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
                tickFormatter={formatTooltipValue}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelClassName="text-foreground"
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                fill={`url(#incomeGradient-${theme})`} 
                name="Income"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill={`url(#expensesGradient-${theme})`} 
                name="Expenses"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
