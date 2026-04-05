'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Lock, Lightbulb, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

const tips = [
  { title: 'The 50/30/20 Rule', desc: 'Allocate 50% to needs, 30% to wants, and 20% to savings for a balanced financial life.' },
  { title: 'Track Every Dollar', desc: 'Studies show that people who track spending save 15-20% more than those who don\'t.' },
  { title: 'Emergency Fund First', desc: 'Build 3-6 months of expenses before investing. ZORVYN helps you visualize this goal.' },
];

export default function EmptyDashboardState() {
  return (
    <div className="space-y-12">
      {/* Onboarding Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 p-10 rounded-[40px] border border-slate-800 backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10" />
        
        <div className="flex items-center gap-3 mb-10">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Your ZORVYN Journey</h2>
        </div>

        <div className="space-y-8">
          {/* Step 1 - Complete */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-black text-white mb-1">Identity Verified</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Your account has been securely provisioned in the ZORVYN network</p>
            </div>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Complete</span>
          </div>

          {/* Step 2 - Pending */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-black text-white mb-1">Awaiting First Transaction</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Your Admin will generate the first financial entry for your account</p>
            </div>
            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Pending</span>
          </div>

          {/* Step 3 - Locked */}
          <div className="flex items-start gap-6 opacity-40">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-black text-white mb-1">Unlock Trend Intelligence</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Charts and analytics will activate once financial data is populated</p>
            </div>
            <span className="text-[9px] font-black text-slate-600 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Locked</span>
          </div>
        </div>
      </motion.div>

      {/* Financial Insight Cards */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-6">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">ZORVYN Financial Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-slate-900/40 p-8 rounded-[32px] border border-slate-800 hover:border-amber-500/20 transition-colors group"
            >
              <div className="bg-amber-500/10 w-fit p-2 rounded-xl mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-black text-white mb-3 tracking-tight">{tip.title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
