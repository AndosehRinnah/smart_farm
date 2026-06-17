"use client";

import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FarmCard from "../../components/farm/FarmCard";
import LivestockCard from "../../components/farm/LivestockCard";
import AddEditFieldDialog from "../../components/farm/AddEditFieldDialog";
import AddEditLivestockDialog from "../../components/farm/AddEditLivestockDialog";
import { dbService } from "../../lib/services/db";
import { MapPin, Users, Search, Wheat, Droplet, Plus, Beef, HeartPulse, Activity, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const cardAnim = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { ease: "easeOut" as const, duration: 0.35 } },
};

export default function FarmPage() {
  const [activeTab, setActiveTab] = useState<'fields' | 'livestock'>('fields');
  const [fields, setFields] = useState<any[]>([]);
  const [livestock, setLivestock] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any | null>(null);
  const [livestockDialogOpen, setLivestockDialogOpen] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState<any | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [fData, lData] = await Promise.all([dbService.getFields(), dbService.getLivestock()]);
      setFields(fData);
      setLivestock(lData);
    } catch (e) {
      console.error("Failed to load agricultural assets:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filteredFields = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return fields;
    return fields.filter(f => f.title.toLowerCase().includes(term) || (f.crop || "").toLowerCase().includes(term));
  }, [q, fields]);

  const filteredLivestock = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return livestock;
    return livestock.filter(l => l.name.toLowerCase().includes(term) || l.type.toLowerCase().includes(term));
  }, [q, livestock]);

  const fieldStats = useMemo(() => {
    const totalArea = fields.reduce((s, f) => s + parseFloat(f.area || "0"), 0);
    const activeWorkers = fields.reduce((s, f) => s + (f.workers || 0), 0);
    const avgMoisture = fields.length > 0
      ? Math.round(fields.reduce((s, f) => s + (f.moisture || 0), 0) / fields.length) : 0;
    return { count: fields.length, area: `${totalArea.toFixed(1)} ha`, workers: activeWorkers, moisture: `${avgMoisture}%` };
  }, [fields]);

  const livestockStats = useMemo(() => {
    const totalAnimals = livestock.reduce((s, l) => s + (l.count || 0), 0);
    const healthyHerds = livestock.filter(l => l.status === 'healthy').length;
    const sickOrQuarantine = livestock.filter(l => l.status !== 'healthy').length;
    return { total: totalAnimals, healthy: healthyHerds, attention: sickOrQuarantine };
  }, [livestock]);

  const handleSaveField = async (data: any) => {
    if (data.id) await dbService.updateField(data.id, data);
    else await dbService.createField(data);
    loadData();
  };
  const handleDeleteField = async (id: string) => {
    if (confirm("Delete this field?")) { await dbService.deleteField(id); loadData(); }
  };
  const handleSaveLivestock = async (data: any) => {
    if (data.id) await dbService.updateLivestock(data.id, data);
    else await dbService.createLivestock(data);
    loadData();
  };
  const handleDeleteLivestock = async (id: string) => {
    if (confirm("Delete this livestock batch?")) { await dbService.deleteLivestock(id); loadData(); }
  };

  const tabs = [
    { id: 'fields' as const, label: 'Crops & Fields', icon: Wheat },
    { id: 'livestock' as const, label: 'Livestock Herds', icon: Beef },
  ];

  const fieldStatCards = [
    { label: "Total Fields", value: fieldStats.count, icon: MapPin, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Area", value: fieldStats.area, icon: Wheat, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Active Workers", value: fieldStats.workers, icon: Users, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { label: "Avg. Moisture", value: fieldStats.moisture, icon: Droplet, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ];

  const livestockStatCards = [
    { label: "Total Animals", value: livestockStats.total.toLocaleString(), icon: Beef, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Healthy Batches", value: livestockStats.healthy, icon: Activity, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Needs Attention", value: livestockStats.attention, icon: HeartPulse, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Active Herds", value: livestock.length, icon: Users, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  const activeStatCards = activeTab === 'fields' ? fieldStatCards : livestockStatCards;

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">

        {/* ── Header ─────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 tracking-wide">
              <Sprout className="w-3.5 h-3.5" />
              Agricultural Assets
            </div>
            <h1 className="sf-heading">Farm Management</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1.5">
              Monitor fields, crop cycles, and livestock herds across your farm.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (activeTab === 'fields') { setSelectedField(null); setFieldDialogOpen(true); }
              else { setSelectedLivestock(null); setLivestockDialogOpen(true); }
            }}
            className="sf-btn-primary shrink-0"
            id="farm-add-btn"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'fields' ? 'Add Field' : 'Add Livestock'}
          </motion.button>
        </header>

        {/* ── Pill Tab Toggle ─────────────────────────── */}
        <div className="flex gap-2 p-1.5 bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800/50 w-fit backdrop-blur-md">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setQ(''); }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                }`}
                id={`farm-tab-${tab.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="farm-tab-bg"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-sm -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Stats Grid ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {activeStatCards.map(({ label, value, icon: Icon, color, bg, border }) => (
              <motion.div
                key={label}
                variants={cardAnim}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`sf-glass p-5 border ${border} transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">{label}</span>
                  <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Search ──────────────────────────────────── */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={activeTab === 'fields' ? "Search fields or crops…" : "Search herds or animal type…"}
            className="sf-input pl-10"
            id="farm-search"
          />
        </div>

        {/* ── Items Grid ──────────────────────────────── */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'fields' ? (
              <motion.section key="fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredFields.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-slate-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-600 dark:text-zinc-400">No fields found</h3>
                    <p className="text-sm mt-1 text-slate-400 dark:text-zinc-500">Add your first field to get started.</p>
                  </div>
                ) : filteredFields.map(f => (
                  <FarmCard key={f.id} field={f} onEdit={() => { setSelectedField(f); setFieldDialogOpen(true); }} onDelete={() => handleDeleteField(f.id)} />
                ))}
              </motion.section>
            ) : (
              <motion.section key="livestock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLivestock.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <Beef className="w-8 h-8 text-slate-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-600 dark:text-zinc-400">No livestock herds found</h3>
                    <p className="text-sm mt-1 text-slate-400 dark:text-zinc-500">Register livestock groups to track counts and health.</p>
                  </div>
                ) : filteredLivestock.map(l => (
                  <LivestockCard key={l.id} livestock={l} onEdit={() => { setSelectedLivestock(l); setLivestockDialogOpen(true); }} onDelete={() => handleDeleteLivestock(l.id)} />
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </div>

      <AddEditFieldDialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen} field={selectedField} onSave={handleSaveField} />
      <AddEditLivestockDialog open={livestockDialogOpen} onOpenChange={setLivestockDialogOpen} livestock={selectedLivestock} onSave={handleSaveLivestock} />
    </DashboardLayout>
  );
}
