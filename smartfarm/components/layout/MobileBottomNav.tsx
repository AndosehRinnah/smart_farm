'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Home, Sprout, Package, Wallet, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/farm', label: 'Farm', icon: Sprout },
  { href: '/inventory', label: 'Stock', icon: Package },
  { href: '/finance', label: 'Finance', icon: Wallet },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export default function MobileBottomNav() {
  const path = usePathname() || '/';
  const { signOut, user } = useAuth();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-zinc-900/60 md:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
    >
      <div className="max-w-sm mx-auto flex justify-between items-end px-2 pb-safe">
        {tabs.map((t) => {
          const active = path === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="relative flex flex-col items-center justify-end flex-1 pt-2 pb-3 gap-0.5 transition-all"
            >
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-emerald-500"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                  />
                )}
              </AnimatePresence>
              <div className={`p-1.5 rounded-xl transition-all ${
                active
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 scale-110'
                  : 'text-slate-400 dark:text-zinc-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-bold tracking-tight ${
                active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'
              }`}>
                {t.label}
              </span>
            </Link>
          );
        })}
        {user && (
          <button
            onClick={() => signOut()}
            className="flex flex-col items-center justify-end flex-1 pt-2 pb-3 gap-0.5 text-rose-400 hover:text-rose-500 cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold tracking-tight">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
