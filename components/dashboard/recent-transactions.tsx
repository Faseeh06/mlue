"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/finance-utils";
import { ArrowUpRight, ArrowDownLeft, Plus, Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
    <Card className="col-span-full lg:col-span-2 bg-transparent border border-gray-200/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-light tracking-tight">LEDGER ENTRIES</CardTitle>
          <CardDescription className="text-gray-600 font-light">All interpreted transactions</CardDescription>
        </div>
        <Button 
          onClick={onAddTransaction} 
          size="sm"
          className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Transaction
        </Button>
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 font-light mb-4">No transactions recorded yet</p>
            <Button 
              onClick={onAddTransaction} 
              variant="outline"
              className="border-2 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Your First Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((transaction) => {
              const isExpanded = expandedIds.has(transaction.id);
              const hasLedgerEntries = transaction.ledgerEntries && transaction.ledgerEntries.length > 0;
              
              return (
                <div key={transaction.id} className="border border-gray-200/30 rounded-lg bg-white/50 overflow-hidden">
                  {/* Main Transaction Row */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-sm text-gray-600 font-light">
                            {formatDate(transaction.date)}
                          </span>
                          {hasLedgerEntries && (
                            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                              {transaction.ledgerEntries.length} entries
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </div>
                      {hasLedgerEntries && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(transaction.id)}
                          title={isExpanded ? "Hide ledger entries" : "Show ledger entries"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                      <div className="flex items-center space-x-2">
                        {onEditTransaction && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200/50"
                            onClick={() => onEditTransaction(transaction)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteTransaction && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200/50"
                            onClick={() => onDeleteTransaction(transaction.id)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Ledger Entries */}
                  {isExpanded && hasLedgerEntries && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      {transaction.interpretation && (
                        <div className="mb-3 bg-blue-50 border border-blue-200 rounded-md p-2">
                          <p className="text-xs text-blue-800 font-light leading-relaxed">
                            💡 {transaction.interpretation}
                          </p>
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-700 mb-2">LEDGER ENTRIES:</p>
                      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="text-left py-2 px-3 font-semibold text-gray-700">Account</th>
                              <th className="text-right py-2 px-3 font-semibold text-gray-700">Debit</th>
                              <th className="text-right py-2 px-3 font-semibold text-gray-700">Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transaction.ledgerEntries!.map((entry, idx) => (
                              <tr key={idx} className="border-t border-gray-200">
                                <td className="py-2 px-3 font-light text-gray-800">{entry.account}</td>
                                <td className="text-right py-2 px-3 font-light text-gray-800">
                                  {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                                </td>
                                <td className="text-right py-2 px-3 font-light text-gray-800">
                                  {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {canViewMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  className="border-2"
                  onClick={() => setShowAll(true)}
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
