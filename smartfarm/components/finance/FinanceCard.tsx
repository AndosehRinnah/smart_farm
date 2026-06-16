"use client";

import { motion } from "framer-motion";
import { PieChart, DollarSign, TrendingUp } from "lucide-react";

type Entry = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date?: string;
};

export default function FinanceCard({ entry }: { entry: Entry }) {
  const positive = entry.type === "income";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className="flex w-full items-center gap-3 overflow-hidden rounded-lg border bg-card p-3 shadow-sm"
    >
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md ${positive ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-destructive text-background"}`}>
        {positive ? <TrendingUp size={18} /> : <DollarSign size={18} />}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="truncate text-sm font-semibold text-card-foreground">{entry.title}</h4>
          <div className={`text-sm font-medium ${positive ? "text-primary" : "text-destructive"}`}>
            {positive ? "+" : "-"}${Math.abs(entry.amount).toLocaleString()}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <PieChart size={14} />
          <span>{entry.date ?? "—"}</span>
        </div>
      </div>
    </motion.article>
  );
}
