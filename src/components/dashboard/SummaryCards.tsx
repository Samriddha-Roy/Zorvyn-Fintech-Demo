'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react';
import { useSummary } from '@/hooks/useData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SummaryCards() {
  const { data: summary, isLoading, error } = useSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-32" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/10 mb-8">
        <CardContent className="p-6 text-destructive font-bold">
          Error loading financial summary metadata.
        </CardContent>
      </Card>
    );
  }

  const cards = [
    { label: 'Net Balance', value: summary?.balance, icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Monthly Income', value: summary?.totalIncome, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Monthly Expenses', value: summary?.totalExpense, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Transaction Count', value: summary?.transactionCount, icon: Receipt, color: 'text-muted-foreground', bg: 'bg-muted/50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="group hover:shadow-lg hover:shadow-indigo-500/5 transition-shadow bg-card/60 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{card.label}</CardTitle>
              <div className={`p-2 rounded-lg transition-colors group-hover:bg-accent ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground tracking-tighter">
                {typeof card.value === 'number' && card.label !== 'Transaction Count'
                    ? `$${card.value.toLocaleString()}`
                    : card.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
