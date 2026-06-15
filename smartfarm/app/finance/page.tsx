"use client";

import { useMemo, useState } from "react";
import FinanceCard from "../../components/finance/FinanceCard";
import StatCard from "../../components/ui/StatCard";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

type Entry = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date?: string;
};

const SAMPLE: Entry[] = [
  { id: "e1", title: "Chicken sales", amount: 120000, type: "income", date: "2026-05-12" },
  { id: "e2", title: "Fertilizer purchase", amount: 32000, type: "expense", date: "2026-05-20" },
  { id: "e3", title: "Vegetable market", amount: 45000, type: "income", date: "2026-06-02" },
  { id: "e4", title: "Veterinary supplies", amount: 15000, type: "expense", date: "2026-06-08" },
];

export default function FinancePage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SAMPLE;
    return SAMPLE.filter((s) => s.title.toLowerCase().includes(t));
  }, [q]);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Financial Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track income, expenses and reports.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="This Month" value={`₦${SAMPLE.filter(s=>s.type==='income').reduce((a,b)=>a+(b.type==='income'?b.amount:0),0).toLocaleString()}`} icon={DollarSign} />
            <StatCard title="Expenses" value={`₦${SAMPLE.filter(s=>s.type==='expense').reduce((a,b)=>a+(b.type==='expense'?b.amount:0),0).toLocaleString()}`} icon={DollarSign} />
          </div>
        </header>

        <div className="mb-4">
          <label className="flex w-full items-center gap-3 rounded-md border bg-card p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search transactions…"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
          </label>
        </div>

        <motion.section layout className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <FinanceCard key={e.id} entry={e} />
          ))}
        </motion.section>
      </div>
    </div>
  );
}
