'use client';

import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatXAF } from "@/lib/utils";
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownRight, Tag, Coins } from "lucide-react";
import { Transaction } from "./financial-summary";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionListProps {
  transactions: Transaction[];
  categories: { id: string; name: string; type: 'income' | 'expense' }[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, categories, onDeleteTransaction }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filtering Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || t.category?.id === categoryFilter;

    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: 'paid' | 'pending' | 'overdue') => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20';
      case 'overdue':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400 dark:bg-rose-500/20';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return 'MTN MoMo / Orange Money';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return 'Other';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white/50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/50 dark:border-zinc-800/80 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-100 hover:bg-transparent dark:border-zinc-800/50">
              <TableHead className="w-[120px] text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-6">Date</TableHead>
              <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</TableHead>
              <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</TableHead>
              <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment Mode</TableHead>
              <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider pr-6">Amount</TableHead>
              <TableHead className="w-[70px] pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredTransactions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
                        <Coins className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">No transactions found</h3>
                      <p className="text-xs text-zinc-500 max-w-xs">
                        Try modifying your filters or add a new transaction to start tracking.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((t) => (
                  <TableRow 
                    key={t.id}
                    className="border-b border-zinc-100/80 hover:bg-zinc-50/40 dark:border-zinc-800/50 dark:hover:bg-zinc-900/30 transition-colors"
                  >
                    {/* Date */}
                    <TableCell className="font-medium text-xs text-zinc-900 dark:text-zinc-300 pl-6">
                      {new Date(t.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    {/* Category */}
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                        <Tag className="h-3.5 w-3.5 text-zinc-400" />
                        {t.category?.name || 'Uncategorized'}
                      </span>
                    </TableCell>
                    {/* Description */}
                    <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
                      {t.description || '—'}
                    </TableCell>
                    {/* Payment Mode */}
                    <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">
                      {getPaymentMethodLabel(t.payment_method)}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getStatusColor(t.status)}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </TableCell>
                    {/* Amount */}
                    <TableCell className={`text-right font-bold text-xs pr-6 ${
                      t.type === 'income' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      <span className="inline-flex items-center gap-0.5">
                        {t.type === 'income' ? '+' : '-'}
                        {formatXAF(t.amount)}
                      </span>
                    </TableCell>
                    {/* Delete Action */}
                    <TableCell className="text-right pr-6">
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
