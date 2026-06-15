"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Activity } from "lucide-react";

type Field = {
  id: string;
  title: string;
  crop?: string;
  area?: string;
  workers?: number;
};

export default function FarmCard({ field }: { field: Field }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className="flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-card p-3 shadow-sm"
    >
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-secondary to-accent">
        <MapPin className="text-card-foreground" size={20} />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-semibold text-card-foreground">{field.title}</h3>
          <div className="text-xs text-muted-foreground">{field.area ?? "—"}</div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Crop: {field.crop ?? "Mixed"}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{field.workers ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity size={14} />
              <span className="capitalize">active</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Details</button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
