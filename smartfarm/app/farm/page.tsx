"use client";

import { useMemo, useState } from "react";
import FarmCard from "../../components/farm/FarmCard";
import StatCard from "../../components/ui/StatCard";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

type Field = {
  id: string;
  title: string;
  crop?: string;
  area?: string;
  workers?: number;
};

const SAMPLE_FIELDS: Field[] = [
  { id: "f1", title: "North Field", crop: "Maize", area: "2.4 ha", workers: 3 },
  { id: "f2", title: "East Plot", crop: "Cassava", area: "1.1 ha", workers: 1 },
  { id: "f3", title: "South Orchard", crop: "Plantain", area: "0.6 ha", workers: 2 },
  { id: "f4", title: "Demo Bed", crop: "Vegetables", area: "0.2 ha", workers: 1 },
];

export default function FarmPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SAMPLE_FIELDS;
    return SAMPLE_FIELDS.filter(
      (f) => f.title.toLowerCase().includes(term) || (f.crop || "").toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Farm Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitor fields, crops and workers.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="Fields" value={SAMPLE_FIELDS.length} icon={MapPin} />
            <StatCard title="Workers" value={SAMPLE_FIELDS.reduce((s, f) => s + (f.workers || 0), 0)} icon={MapPin} />
          </div>
        </header>

        <div className="mb-4">
          <label className="flex w-full items-center gap-3 rounded-md border bg-card p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fields or crops…"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
          </label>
        </div>

        <motion.section layout className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((f) => (
            <FarmCard key={f.id} field={f} />
          ))}
        </motion.section>
      </div>
    </div>
  );
}
