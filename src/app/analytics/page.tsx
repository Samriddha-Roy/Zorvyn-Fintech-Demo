'use client';

import { useState } from 'react';
import { useAnalytics, useGlobalAnalytics } from '@/hooks/useData';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieIcon, Calendar, ChevronRight, Globe, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const role = (user?.role as UserRole) || 'VIEWER';
  const { data: personalAnalytics, isLoading: isPersonalLoading } = useAnalytics();
  const { data: globalAnalytics, isLoading: isGlobalLoading } = useGlobalAnalytics();
  const hasPersonalData = (personalAnalytics?.length || 0) > 0;
  const [viewMode, setViewMode] = useState<'personal' | 'global'>(hasPersonalData ? 'personal' : 'global');
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const analytics = viewMode === 'global' ? globalAnalytics : personalAnalytics;
  const isLoading = viewMode === 'global' ? isGlobalLoading : isPersonalLoading;
  const totalVolume = analytics?.reduce((acc, curr) => acc + curr.income + curr.expense, 0) || 0;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter mb-3 leading-none flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-xl"><TrendingUp className="w-8 h-8 text-primary" /></div>
            Forecast & Trends
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">
            {viewMode === 'global' ? 'Platform-wide anonymized financial intelligence' : 'Your personal financial trajectory'}
          </p>
        </div>

        {(role === 'ANALYST' || role === 'ADMIN') && (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="personal" className="gap-2 text-[10px] font-black uppercase tracking-widest">
                <User className="w-3 h-3" /> My Data
              </TabsTrigger>
              <TabsTrigger value="global" className="gap-2 text-[10px] font-black uppercase tracking-widest">
                <Globe className="w-3 h-3" /> Global Market
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </header>

      {!isLoading && (!analytics || analytics.length === 0) && (
        <Card className="border-dashed text-center py-16">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-muted-foreground mb-3 tracking-tighter">
              {viewMode === 'global' ? 'No Platform Data Yet' : 'No Personal Data Yet'}
            </h3>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-md mx-auto leading-relaxed">
              {viewMode === 'global'
                ? 'The ZORVYN ecosystem has no transaction data. An Admin needs to generate records first.'
                : 'Switch to Global Market view to see platform-wide trends.'}
            </p>
            {viewMode === 'personal' && (
              <Button variant="link" className="mt-6 gap-2" onClick={() => setViewMode('global')}>
                <Globe className="w-3 h-3" /> Switch to Global Market
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {analytics && analytics.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <Card className="bg-card/60 border-border relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                      {viewMode === 'global' ? 'Platform Cash Velocity' : 'Monthly Cash Velocity'}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Click to drill down</Badge>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} fontWeight="bold"
                          tickFormatter={(str) => format(parseISO(str + "-01"), 'MMM yy').toUpperCase()} axisLine={false} tickLine={false} dy={10} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                        <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} onClick={(data) => setActiveMonth(data.month)} cursor="pointer" />
                        <Bar dataKey="expense" fill="#ec4899" radius={[6, 6, 0, 0]} onClick={(data) => setActiveMonth(data.month)} cursor="pointer" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-card/60 border-border h-full flex flex-col items-center justify-center text-center">
                <CardHeader>
                  <PieIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                    {viewMode === 'global' ? 'Platform Volume' : 'System Volume'}
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest">Distribution Across Periods</CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total" stroke="none">
                          {analytics?.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-3xl font-black text-foreground tracking-widest mt-4">${totalVolume.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-1">Total Throughput</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <AnimatePresence>
            {activeMonth && (
              <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <CardTitle className="text-xs font-black uppercase tracking-widest">
                          Drill-Down: {format(parseISO(activeMonth + "-01"), 'MMMM yyyy')}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-[10px] uppercase tracking-widest">Filtered records for the selected period</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveMonth(null)} className="text-[10px] font-black uppercase">
                      Clear
                    </Button>
                  </CardHeader>
                  <CardContent><TransactionTable /></CardContent>
                </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
