"use client";

import { motion } from "framer-motion";
import { Box, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

type Item = {
  id: string;
  name: string;
  category?: string;
  qty: number;
  unit?: string;
  image?: string;
  lowStock?: boolean;
};

export default function InventoryCard({ item }: { item: Item }) {
  const borderColor =
    (item.category || "").toLowerCase() === "seeds"
      ? "border-l-4 border-green-400"
      : (item.category || "").toLowerCase() === "feed"
      ? "border-l-4 border-amber-400"
      : (item.category || "").toLowerCase() === "fertilizer"
      ? "border-l-4 border-lime-400"
      : (item.category || "").toLowerCase() === "medicine"
      ? "border-l-4 border-rose-400"
      : "border-l-4 border-primary";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className={`group flex w-full items-center gap-4 overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md ${borderColor}`}
    >
      <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-primary to-accent">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-background">
            <Box size={20} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold text-card-foreground">
            {item.name}
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                item.lowStock ? "bg-destructive text-background" : "bg-primary text-primary-foreground"
              }`}
            >
              {item.qty} {item.unit ?? "pcs"}
            </motion.div>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="truncate">{item.category ?? "General"}</div>
          <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
            {item.lowStock && (
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <AlertTriangle className="text-destructive" size={16} />
              </motion.div>
            )}
            <motion.button whileTap={{ scale: 0.95 }} className="cursor-pointer text-muted">
              <Edit2 size={16} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="cursor-pointer text-muted">
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
