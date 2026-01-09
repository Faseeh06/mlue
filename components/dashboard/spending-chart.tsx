"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface SpendingChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  // Apply Arial font to all SVG text elements in the chart
  useEffect(() => {
    const applyChartFont = () => {
      const chartContainer = document.querySelector('.spending-chart-container');
      if (chartContainer) {
        const svgTextElements = chartContainer.querySelectorAll('svg text, text, .recharts-wrapper text');
        svgTextElements.forEach((textEl: any) => {
          if (textEl && textEl.style) {
            textEl.style.fontFamily = 'Arial, Helvetica, sans-serif';
            textEl.style.fontWeight = '400';
            textEl.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
            textEl.setAttribute('font-weight', '400');
          }
        });
      }
    };
    
    // Apply immediately and also after delays to catch dynamically rendered elements
    applyChartFont();
    const timer1 = setTimeout(applyChartFont, 100);
    const timer2 = setTimeout(applyChartFont, 300);
    const timer3 = setTimeout(applyChartFont, 500);
    
    // Use MutationObserver to watch for new SVG elements being added
    const chartContainer = document.querySelector('.spending-chart-container');
    let observer: MutationObserver | null = null;
    
    if (chartContainer) {
      observer = new MutationObserver(() => {
        applyChartFont();
      });
      
      observer.observe(chartContainer, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [data]);

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatYAxisLabel = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return `${Math.round(value)}`;
  };

  const formatMonthLabel = (month: string) => {
    // Take first 3 letters if month is longer
    return month.substring(0, 3);
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
          <div className="spending-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b21b6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5b21b6" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d8b4fe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d8b4fe" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                fontSize={11}
                tickFormatter={formatMonthLabel}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontWeight: 400
                }}
                label={{ 
                  value: 'Month', 
                  position: 'insideBottom', 
                  offset: -5, 
                  style: { 
                    fontSize: '9px',
                    fontWeight: 400,
                    fill: 'hsl(var(--foreground))'
                  } 
                }}
              />
              <YAxis 
                fontSize={11}
                tickFormatter={formatYAxisLabel}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: 400
                }}
                label={{ 
                  value: 'Amount', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { 
                    fontSize: '9px',
                    fontWeight: 400,
                    fill: 'hsl(var(--foreground))'
                  } 
                }}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '9px',
                }}
                labelStyle={{
                  fontWeight: 500,
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontSize: '9px',
                  fontWeight: 400,
                }}
              />
              <Bar 
                dataKey="income" 
                fill="url(#incomeGradient)" 
                name="Income"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="url(#expensesGradient)" 
                name="Expenses"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
