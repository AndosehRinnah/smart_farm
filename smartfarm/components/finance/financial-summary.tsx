'use client';

import { Card, CardContent } from "@/components/ui/card";
import { formatXAF } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Wallet, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: {
    id: string;
    name: string;
    icon?: string;
  } | null;
  description: string;
  date: string;
  payment_method: 'cash' | 'mobile_money' | 'bank_transfer' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  crop_cycle_id?: string;
  herd_id?: string;
};

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  // Calculations (filtering on 'paid' for income/expenses)
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashFlow = totalIncome - totalExpense;

  const pendingAmount = transactions
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const cards = [
    {
      title: "Total Income",
      value: formatXAF(totalIncome),
      description: "Cleared earnings from harvests/sales",
      icon: ArrowUpRight,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgColorClass: "bg-emerald-500/10",
      borderColorClass: "hover:border-emerald-500/30",
      gradient: "from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-zinc-900"
    },
    {
      title: "Total Expenses",
      value: formatXAF(totalExpense),
      description: "Operational farm costs (feed, seeds, labor)",
      icon: ArrowDownRight,
      colorClass: "text-rose-600 dark:text-rose-400",
      bgColorClass: "bg-rose-500/10",
      borderColorClass: "hover:border-rose-500/30",
      gradient: "from-rose-50/50 to-white dark:from-rose-950/20 dark:to-zinc-900"
    },
    {
      title: "Net Cash Flow",
      value: formatXAF(netCashFlow),
      description: netCashFlow >= 0 ? "Net surplus profit" : "Net deficit loss",
      icon: TrendingUp,
      colorClass: netCashFlow >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400",
      bgColorClass: netCashFlow >= 0 ? "bg-indigo-500/10" : "bg-amber-500/10",
      borderColorClass: netCashFlow >= 0 ? "hover:border-indigo-500/30" : "hover:border-amber-500/30",
      gradient: netCashFlow >= 0 
        ? "from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-zinc-900"
        : "from-amber-50/50 to-white dark:from-amber-950/20 dark:to-zinc-900"
    },
    {
      title: "Pending / Overdue",
      value: formatXAF(pendingAmount),
      description: "Outstanding invoices & commitments",
      icon: Clock,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgColorClass: "bg-amber-500/10",
      borderColorClass: "hover:border-amber-500/30",
      gradient: "from-amber-50/50 to-white dark:from-amber-950/20 dark:to-zinc-900"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants as any}
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full"
          >
            <Card className={`overflow-hidden border border-zinc-200/80 bg-gradient-to-br ${card.gradient} transition-all duration-300 dark:border-zinc-800/80 shadow-sm hover:shadow-md ${card.borderColorClass}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.title}</span>
                  <div className={`p-2 rounded-xl ${card.bgColorClass} ${card.colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{card.value}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
