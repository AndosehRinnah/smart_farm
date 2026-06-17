'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../components/providers/AuthProvider';
import { Sprout, Lock, Mail, ArrowRight, AlertCircle, Info, Eye, EyeOff, Wheat, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  { icon: Wheat, label: 'Crop & Field Management' },
  { icon: BarChart3, label: 'Financial Analytics' },
  { icon: Users, label: 'Worker Task Tracking' },
];

export default function LoginPage() {
  const { signIn, isLocal } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError(null);
    setSubmitting(true);
    const res = await signIn(email, password);
    if (res.error) { setError(res.error); setSubmitting(false); }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-slate-950 font-sans text-slate-100 overflow-hidden">

      {/* ── LEFT DECORATIVE PANEL (desktop only) ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-start justify-between p-12 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[130px]"
          />
          <motion.div
            animate={{ scale: [1, 0.9, 1.1, 1], x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/12 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 0.95, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[50%] left-[30%] w-[200px] h-[200px] rounded-full bg-teal-400/8 blur-[80px]"
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white">SmartFarm</div>
            <div className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">Farm Intelligence</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-extrabold tracking-tight leading-tight mb-6"
          >
            Your Farm,{' '}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
              Intelligently
            </span>
            <br />
            Managed.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-400 text-base font-medium leading-relaxed mb-10 max-w-sm"
          >
            Designed for farmers in Cameroon and Africa. Grow more, waste less, earn more — from one intelligent platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-slate-300">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-xs text-slate-600 font-medium"
        >
          University of Buea · Department of Computer Science · SmartFarm Project 2025/2026
        </motion.div>
      </div>

      {/* ── RIGHT FORM PANEL ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Background for right side */}
        <div className="absolute inset-0 lg:hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 0.95, 1], x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 0.9, 1.15, 1], x: [0, -40, 30, 0], y: [0, 40, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[120px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile-only logo */}
          <div className="flex flex-col items-center text-center mb-8 lg:hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 border border-emerald-500/30 shadow-xl shadow-emerald-500/30 mb-4"
            >
              <Sprout className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">SmartFarm</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">Sign in to your farm dashboard</p>
          </div>

          {/* Prototype hint banner */}
          {isLocal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-5 flex gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs leading-relaxed font-medium"
            >
              <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <div>
                <span className="font-bold block text-white mb-0.5">Standalone Mode</span>
                Use <code className="text-white bg-indigo-500/20 px-1 py-0.5 rounded font-mono">admin@smartfarm.com</code> / <code className="text-white bg-indigo-500/20 px-1 py-0.5 rounded font-mono">admin123</code>
              </div>
            </motion.div>
          )}

          {/* Card form */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-7 rounded-2xl shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm font-medium placeholder:text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white"
                    required
                    id="login-email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm font-medium placeholder:text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-white"
                    required
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold py-3.5 shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50 transition-all text-sm mt-2"
                id="login-submit"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs">
              <span className="text-slate-600">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Register here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
