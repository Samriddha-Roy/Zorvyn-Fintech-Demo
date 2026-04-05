'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';
import { useSummary } from '@/hooks/useData';
import { cn } from '@/lib/utils';

export default function SummaryCards() {
  const { data: summary, isLoading, error } = useSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl mb-8 font-bold">
        Error loading financial summary metadata.
      </div>
    );
  }

  const cards = [
    { label: 'Net Balance', value: summary?.balance, icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Monthly Income', value: summary?.totalIncome, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Monthly Expenses', value: summary?.totalExpense, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Transaction Count', value: summary?.transactionCount, icon: Receipt, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-sm transition-shadow hover:shadow-lg hover:shadow-indigo-500/5 group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{card.label}</span>
            <div className={cn("p-2 rounded-lg transition-colors group-hover:bg-slate-800", card.bg)}>
              <card.icon className={cn("w-5 h-5", card.color)} />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tighter">
            {typeof card.value === 'number' && card.label !== 'Transaction Count' 
                ? `$${card.value.toLocaleString()}` 
                : card.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
