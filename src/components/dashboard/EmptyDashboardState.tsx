'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Lock, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const tips = [
  { title: 'The 50/30/20 Rule', desc: 'Allocate 50% to needs, 30% to wants, and 20% to savings for a balanced financial life.' },
  { title: 'Track Every Dollar', desc: 'Studies show that people who track spending save 15-20% more than those who don\'t.' },
  { title: 'Emergency Fund First', desc: 'Build 3-6 months of expenses before investing. ZORVYN helps you visualize this goal.' },
];

export default function EmptyDashboardState() {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-card/60 border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Your ZORVYN Journey</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-black text-foreground mb-1">Identity Verified</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Your account has been securely provisioned</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-[9px]">Complete</Badge>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-black text-foreground mb-1">Awaiting First Transaction</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Your Admin will generate the first financial entry</p>
              </div>
              <Badge variant="outline" className="border-amber-500/30 text-amber-500 text-[9px]">Pending</Badge>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="flex items-start gap-6 opacity-40">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-black text-foreground mb-1">Unlock Trend Intelligence</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Charts activate after data is populated</p>
              </div>
              <Badge variant="secondary" className="text-[9px]">Locked</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Finance Tips */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-6">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">ZORVYN Financial Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <motion.div key={tip.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}>
              <Card className="bg-card/60 border-border hover:border-amber-500/20 transition-colors group h-full">
                <CardContent className="p-8">
                  <div className="bg-amber-500/10 w-fit p-2 rounded-xl mb-5 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black text-foreground mb-3 tracking-tight">{tip.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">{tip.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
