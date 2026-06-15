"use client";

import { useMemo, useState } from "react";
import InventoryCard from "../../components/inventory/InventoryCard";
import StatCard from "../../components/ui/StatCard";
import { Plus, Box } from "lucide-react";
import { motion } from "framer-motion";

type Item = {
  id: string;
  name: string;
  category?: string;
  qty: number;
  unit?: string;
  lowStock?: boolean;
};

const SAMPLE: Item[] = [
  { id: "1", name: "Maize Seed", category: "Seeds", qty: 120, unit: "kg" },
  { id: "2", name: "Layer Feed", category: "Feed", qty: 8, unit: "bags", lowStock: true },
  { id: "3", name: "NPK Fertilizer", category: "Fertilizer", qty: 24, unit: "kg" },
  { id: "4", name: "Oxytetracycline", category: "Medicine", qty: 2, unit: "bottles", lowStock: true },
  { id: "5", name: "Cow Hay", category: "Feed", qty: 60, unit: "bales" },
];

export default function InventoryPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SAMPLE;
    return SAMPLE.filter(
      (i) => i.name.toLowerCase().includes(term) || (i.category || "").toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Inventory</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage seeds, feed, fertilizer and medicines.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden gap-3 sm:flex">
              <StatCard title="Total Items" value={SAMPLE.length} icon={Box} />
              <StatCard title="Low Stock" value={SAMPLE.filter((s) => s.lowStock).length} icon={Box} />
            </div>
            <button className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:flex">
              <Plus size={16} /> Add Item
            </button>
          </div>
        </header>

        <div className="mb-4 flex w-full gap-3">
          <label className="flex w-full items-center gap-3 rounded-md border bg-card p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search inventory…"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
          </label>
          <button className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground sm:hidden">
            <Plus size={14} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-auto pb-1">
          <button className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">All</button>
          <button className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Seeds</button>
          <button className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Feed</button>
          <button className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Fertilizer</button>
          <button className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Medicine</button>
        </div>

        <motion.section layout className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((it) => (
            <InventoryCard key={it.id} item={it} />
          ))}
        </motion.section>
      </div>
    </div>
  );
}
