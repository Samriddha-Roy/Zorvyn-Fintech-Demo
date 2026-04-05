'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSummary } from '@/hooks/useData';
import SummaryCards from '@/components/dashboard/SummaryCards';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import TransactionTable from '@/components/dashboard/TransactionTable';
import TransactionForm from '@/components/dashboard/TransactionForm';
import EmptyDashboardState from '@/components/dashboard/EmptyDashboardState';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import { Plus, ShieldCheck, Lock, Activity, BarChart3, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = (user?.role as UserRole) || 'VIEWER';
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { data: summary } = useSummary();

  const canViewReports = role === 'ANALYST' || role === 'ADMIN';
  const canManageData = role === 'ADMIN';
  const hasData = (summary?.transactionCount || 0) > 0;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 px-2">
        <div className="space-y-4">
          <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Environment
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
            Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Hub</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] max-w-sm">
            Logged in as: <span className="text-foreground font-black">{user?.firstName} {user?.lastName}</span> • Status: <span className="text-primary">{role} MODE</span>
          </p>
        </div>

        {canManageData && (
          <Button size="lg" className="gap-3 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl px-8 py-6 shadow-2xl shadow-primary/30" onClick={() => setShowTransactionModal(true)}>
            <Plus className="w-4 h-4" /> Generate Record
          </Button>
        )}
      </header>

      {/* Summary Cards */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Live Telemetry Summary</h2>
        </div>
        <SummaryCards />
      </section>

      {/* Viewer Onboarding */}
      {role === 'VIEWER' && !hasData && <EmptyDashboardState />}

      {/* Content Sections */}
      {(canViewReports || hasData) && (
        <div className="grid grid-cols-1 gap-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Trend Intelligence</h2>
            </div>
            {canViewReports ? (
              <AnalyticsChart />
            ) : (
              <Card className="border-dashed text-center py-16">
                <CardContent>
                  <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-muted-foreground mb-3 tracking-tighter">Charts Restricted</h3>
                  <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">
                    Visual trend analysis requires Analyst or Admin clearance.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-primary" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Secure Ledger Logs</h2>
              </div>
              {!canViewReports && <Badge variant="destructive" className="gap-1.5 text-[9px]"><Lock className="w-3 h-3" /> Encrypted</Badge>}
            </div>
            {canViewReports ? (
              <TransactionTable />
            ) : (
              <Card className="border-dashed border-destructive/20 text-center py-16">
                <CardContent>
                  <Lock className="w-10 h-10 text-destructive/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-destructive/60 mb-3 tracking-tighter">Ledger Access Denied</h3>
                  <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">
                    The detailed transaction log is restricted to cleared personnel.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}

      <AnimatePresence>
        {showTransactionModal && <TransactionForm onClose={() => setShowTransactionModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
