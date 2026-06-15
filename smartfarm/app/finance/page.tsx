'use client';

import { useState, useEffect } from "react";
import { FinancialSummary, Transaction } from "@/components/finance/financial-summary";
import { FinancialCharts } from "@/components/finance/financial-charts";
import { TransactionList } from "@/components/finance/transaction-list";
import { AddTransactionDialog } from "@/components/finance/add-transaction-dialog";
import { createClient } from "@/lib/supabase/client";
import { Database, WifiOff, Sparkles, Sprout, ArrowLeft, ArrowUpRight, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock Categories matching SQL seed
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Crop Harvest Sales", type: "income" as const },
  { id: "cat-2", name: "Livestock Sales", type: "income" as const },
  { id: "cat-3", name: "Equipment Rental", type: "income" as const },
  { id: "cat-4", name: "Government Grants", type: "income" as const },
  { id: "cat-5", name: "Other Income", type: "income" as const },
  { id: "cat-6", name: "Seeds & Seedlings", type: "expense" as const },
  { id: "cat-7", name: "Animal Feed", type: "expense" as const },
  { id: "cat-8", name: "Fertilizer & Pesticides", type: "expense" as const },
  { id: "cat-9", name: "Veterinary & Medicine", type: "expense" as const },
  { id: "cat-10", name: "Wages & Labor", type: "expense" as const },
  { id: "cat-11", name: "Fuel & Machinery Rent", type: "expense" as const },
  { id: "cat-12", name: "Other Expense", type: "expense" as const },
];

// Seed Mock Transactions spanning 6 months
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "expense",
    amount: 180000,
    category: { id: "cat-7", name: "Animal Feed" },
    description: "Purchase of high-protein layer mash feed",
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 12).toISOString().split('T')[0],
    payment_method: "mobile_money",
    status: "paid"
  },
  {
    id: "tx-2",
    type: "expense",
    amount: 45000,
    category: { id: "cat-6", name: "Seeds & Seedlings" },
    description: "Improved hybrid tomato seeds from local supplier",
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 25).toISOString().split('T')[0],
    payment_method: "cash",
    status: "paid"
  },
  {
    id: "tx-3",
    type: "income",
    amount: 480000,
    category: { id: "cat-1", name: "Crop Harvest Sales" },
    description: "Sold 12 bags of dry white maize harvest",
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5).toISOString().split('T')[0],
    payment_method: "mobile_money",
    status: "paid"
  },
  {
    id: "tx-4",
    type: "expense",
    amount: 95000,
    category: { id: "cat-8", name: "Fertilizer & Pesticides" },
    description: "NPK 20-10-10 bags for crop dressing",
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 18).toISOString().split('T')[0],
    payment_method: "bank_transfer",
    status: "paid"
  },
  {
    id: "tx-5",
    type: "expense",
    amount: 120000,
    category: { id: "cat-10", name: "Wages & Labor" },
    description: "Wages for two casual workers for weeding",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0],
    payment_method: "cash",
    status: "paid"
  },
  {
    id: "tx-6",
    type: "income",
    amount: 320000,
    category: { id: "cat-2", name: "Livestock Sales" },
    description: "Sold 4 broiler chickens batches to market buyer",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
    payment_method: "mobile_money",
    status: "paid"
  },
  {
    id: "tx-7",
    type: "expense",
    amount: 40000,
    category: { id: "cat-11", name: "Fuel & Machinery Rent" },
    description: "Tractor fuel for secondary ploughing season",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().split('T')[0],
    payment_method: "cash",
    status: "pending"
  }
];

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; type: 'income' | 'expense' }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const supabase = createClient();
      
      try {
        // Test connection by fetching categories
        const { data: catData, error: catError } = await supabase
          .from("financial_categories")
          .select("*");

        if (catError || !catData || catData.length === 0) {
          throw new Error("Unable to fetch data from Supabase; falling back to sandbox mode.");
        }

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select(`
            *,
            category:financial_categories(id, name, type)
          `)
          .order("date", { ascending: false });

        if (txError) throw txError;

        setCategories(catData);
        setTransactions(txData || []);
        setIsDemoMode(false);
      } catch (err) {
        console.warn("Using persistent demonstration mode:", err);
        setIsDemoMode(true);
        setCategories(MOCK_CATEGORIES);

        // Load sandbox from LocalStorage if present, else seed default
        const savedTx = localStorage.getItem("smartfarm_mock_transactions");
        if (savedTx) {
          setTransactions(JSON.parse(savedTx));
        } else {
          setTransactions(MOCK_TRANSACTIONS);
          localStorage.setItem("smartfarm_mock_transactions", JSON.stringify(MOCK_TRANSACTIONS));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddTransaction = async (values: any) => {
    if (isDemoMode) {
      const selectedCategory = MOCK_CATEGORIES.find(c => c.id === values.category_id);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: values.type,
        amount: Number(values.amount),
        category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
        description: values.description || "",
        date: values.date,
        payment_method: values.payment_method,
        status: values.status
      };

      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem("smartfarm_mock_transactions", JSON.stringify(updated));
    } else {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("transactions")
        .insert([{
          user_id: user?.id,
          type: values.type,
          amount: Number(values.amount),
          category_id: values.category_id,
          description: values.description,
          date: values.date,
          payment_method: values.payment_method,
          status: values.status
        }])
        .select(`
          *,
          category:financial_categories(id, name, type)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setTransactions([data, ...transactions]);
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (isDemoMode) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem("smartfarm_mock_transactions", JSON.stringify(updated));
    } else {
      const supabase = createClient();
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/80 font-sans">
      {/* Title tags & Meta description implemented inside the React context (App layout will hook this) */}
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70 py-4 px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 transition-colors shadow-sm">
              <ArrowLeft className="h-4 w-4 text-zinc-500" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Financial Management</h1>
                {/* Demo sandbox notice badge */}
                {isDemoMode ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Sandbox Mode
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live database
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Track income, operational expenses, cashflow and generate automated P&L metrics
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AddTransactionDialog categories={categories} onAddTransaction={handleAddTransaction} />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-6 px-6 md:px-8 space-y-6 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="h-80 md:col-span-2 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-900" />
              <div className="h-80 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-900" />
            </div>
            <div className="h-96 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-900" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* 1. Statistics Cards */}
            <FinancialSummary transactions={transactions} />

            {/* 2. Charts & Analytics */}
            <FinancialCharts transactions={transactions} />

            {/* 3. Transaction Register Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-md font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Transactions Register</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Filter, search, or delete past entries</p>
                </div>
              </div>
              <TransactionList 
                transactions={transactions} 
                categories={categories}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
