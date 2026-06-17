'use client';
import React from 'react';
import MobileBottomNav from '../layout/MobileBottomNav';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sprout, Package, Wallet, CheckSquare, LogOut, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

type Props = {
  children: React.ReactNode;
};

const sidebarLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/farm', label: 'Farm', icon: Sprout },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/finance', label: 'Finance', icon: Wallet },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
];

function getInitials(email: string) {
  return email?.split('@')[0]?.slice(0, 2).toUpperCase() || 'SF';
}

export default function DashboardLayout({ children }: Props) {
  const pathname = usePathname();
  const { user, signOut, isLocal } = useAuth();

  const currentPage = sidebarLinks.find(l => l.href === pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-[100vh] bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-8%] w-[45%] h-[45%] rounded-full bg-emerald-500/6 blur-[140px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-[-15%] right-[-8%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[140px] dark:bg-indigo-500/10" />
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] rounded-full bg-emerald-400/3 blur-[100px] dark:bg-emerald-400/5" />
      </div>

      <div className="relative z-10 w-[min(100%,92vw)] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Prototype banner */}
        {isLocal && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs px-4 py-2 mt-4 rounded-xl flex items-center gap-2"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>Running in <strong>Offline Prototype Mode</strong>. Connect Supabase credentials to sync with the cloud.</span>
          </motion.div>
        )}

        {/* Mobile top header */}
        <div className="flex items-center justify-between py-4 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-white">SmartFarm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-slate-500 dark:text-zinc-400">{currentPage}</div>
            {user && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-500/20">
                {getInitials(user.email)}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 md:pt-8 pb-28 md:pb-10">

          {/* Sidebar */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-2">
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="sticky top-8"
            >
              <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-800/50 p-5 rounded-2xl shadow-sm">

                {/* Logo */}
                <div className="flex items-center gap-3 px-1 mb-8">
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                    <Sprout className="w-5 h-5 text-white" />
                    <div className="absolute inset-0 rounded-xl ring-2 ring-emerald-400/40 ring-offset-1 ring-offset-transparent" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">SmartFarm</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Farm Intelligence</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-2">Navigation</div>

                <ul className="space-y-1">
                  {sidebarLinks.map((l) => {
                    const isActive = pathname === l.href;
                    const Icon = l.icon;
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute inset-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 -z-10"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                            />
                          )}
                          <div className={`p-1.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {l.label}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500 dark:text-emerald-400" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* User profile */}
                {user && (
                  <div className="mt-8 pt-5 border-t border-slate-200/60 dark:border-zinc-800/60">
                    <div className="flex items-center gap-3 px-1 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-500/20 shrink-0">
                        {getInitials(user.email)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">{user.email}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold mt-0.5">{user.role || 'Farm Owner'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.nav>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-9 lg:col-span-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="min-h-[80vh]"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
