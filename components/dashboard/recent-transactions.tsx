"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/finance-utils";
import { ArrowUpRight, ArrowDownLeft, Plus, Pencil, Trash } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export function RecentTransactions({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction }: RecentTransactionsProps) {
  return (
    <Card className="col-span-full lg:col-span-2 bg-transparent border border-gray-200/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-light tracking-tight">RECENT TRANSACTIONS</CardTitle>
          <CardDescription className="text-gray-600 font-light">Your latest financial activities</CardDescription>
        </div>
        <Button 
          onClick={onAddTransaction} 
          size="sm"
          className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 font-light mb-4">No transactions yet</p>
            <Button 
              onClick={onAddTransaction} 
              variant="outline"
              className="border-2 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200/30 rounded-lg bg-transparent">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-light">{transaction.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-sm text-gray-600 font-light">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`font-light ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
