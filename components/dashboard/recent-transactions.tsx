"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/finance-utils";
import { ArrowUpRight, ArrowDownLeft, Plus, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  initialLimit?: number;
}

export function RecentTransactions({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction, initialLimit = 5 }: RecentTransactionsProps) {
  const [showAll, setShowAll] = useState(false);

  const parseIdTs = (id: string): number => {
    const match = id.match(/^(\d{10,})/);
    return match ? Number(match[1]) : 0;
  };

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (db !== da) return db - da; // newer date first
      // Same day: fall back to id numeric prefix (Date.now() in generateId)
      const ia = parseIdTs(a.id);
      const ib = parseIdTs(b.id);
      if (ib !== ia) return ib - ia; // newer id first
      // Final fallback: compare description to keep sort stable
      return (b.description || "").localeCompare(a.description || "");
    });
  }, [transactions]);

  const visible = showAll ? sorted : sorted.slice(0, initialLimit);
  const canViewMore = !showAll && sorted.length > initialLimit;

  return (
    <Card className="col-span-full lg:col-span-2 bg-secondary">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="uppercase tracking-widest font-medium text-sm">TRANSACTIONS</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">Latest at the top</CardDescription>
        </div>
        <Button 
          onClick={onAddTransaction} 
          size="sm" 
          variant="ghost"
          className="rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-light mb-4">No transactions yet</p>
            <Button 
              onClick={onAddTransaction} 
              variant="outline"
              className="rounded-full border border-foreground/30 bg-transparent hover:bg-secondary h-12 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {visible.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg bg-background">
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    transaction.type === 'income' ? 'bg-lime/20 text-iris' : 'bg-lilac/20 text-iris'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm sm:text-base break-words">{transaction.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:mt-1">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-3 flex-shrink-0">
                  <div className="font-serif text-foreground text-base sm:text-lg whitespace-nowrap">
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {onEditTransaction && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTransaction(transaction)}
                        title="Edit"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {onDeleteTransaction && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        title="Delete"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {canViewMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(true)}
                  className="rounded-full border border-foreground/30 bg-transparent hover:bg-secondary"
                >
                  View more
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
