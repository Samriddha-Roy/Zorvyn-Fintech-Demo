'use client';

import { useState } from 'react';
import { useAnalytics, useGlobalAnalytics, useTransactions } from '@/hooks/useData';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieIcon, Calendar, ChevronRight, Globe, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TransactionTable from '@/components/dashboard/TransactionTable';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const role = (user?.role as UserRole) || 'VIEWER';

  const { data: personalAnalytics, isLoading: isPersonalLoading } = useAnalytics();
  const { data: globalAnalytics, isLoading: isGlobalLoading } = useGlobalAnalytics();
  
  const hasPersonalData = (personalAnalytics?.length || 0) > 0;
  
  // Default to global view if analyst has no personal data
  const [viewMode, setViewMode] = useState<'personal' | 'global'>(hasPersonalData ? 'personal' : 'global');
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  // Choose which data to render
  const analytics = viewMode === 'global' ? globalAnalytics : personalAnalytics;
  const isLoading = viewMode === 'global' ? isGlobalLoading : isPersonalLoading;
  const totalVolume = analytics?.reduce((acc, curr) => acc + curr.income + curr.expense, 0) || 0;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none flex items-center gap-4">
             <div className="bg-indigo-600/20 p-2 rounded-xl">
               <TrendingUp className="w-8 h-8 text-indigo-500" />
             </div>
             Forecast & Trends
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">
            {viewMode === 'global' ? 'Platform-wide anonymized financial intelligence' : 'Your personal financial trajectory'}
          </p>
        </div>

        {/* View Mode Toggle (Analyst/Admin) */}
        {(role === 'ANALYST' || role === 'ADMIN') && (
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'personal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              <User className="w-3 h-3" /> My Data
            </button>
            <button
              onClick={() => setViewMode('global')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'global' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Globe className="w-3 h-3" /> Global Market
            </button>
          </div>
        )}
      </header>

      {/* Empty State for no data */}
      {!isLoading && (!analytics || analytics.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 p-16 rounded-[40px] border border-dashed border-slate-800 text-center"
        >
          <BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-400 mb-3 tracking-tighter">
            {viewMode === 'global' ? 'No Platform Data Yet' : 'No Personal Data Yet'}
          </h3>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-md mx-auto leading-relaxed">
            {viewMode === 'global' 
              ? 'The ZORVYN ecosystem has no transaction data. An Admin needs to generate records first.'
              : 'Switch to Global Market view to see platform-wide trends, or ask an Admin to generate transactions for your account.'
            }
          </p>
          {viewMode === 'personal' && (
            <button
              onClick={() => setViewMode('global')}
              className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 hover:text-white transition-all mx-auto"
            >
              <Globe className="w-3 h-3" /> Switch to Global Market View
            </button>
          )}
        </motion.div>
      )}

      {/* Charts Grid - only show when data exists */}
      {analytics && analytics.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Monthly Trend Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 backdrop-blur-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10" />
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    {viewMode === 'global' ? 'Platform Cash Velocity' : 'Monthly Cash Velocity'}
                  </h2>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click any bar to drill down</p>
              </div>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickFormatter={(str) => format(parseISO(str + "-01"), 'MMM yy').toUpperCase()} 
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} onClick={(data) => setActiveMonth(data.month)} cursor="pointer" />
                    <Bar dataKey="expense" fill="#ec4899" radius={[6, 6, 0, 0]} onClick={(data) => setActiveMonth(data.month)} cursor="pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Donut Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px] -z-10" />
              <div className="text-center mb-8">
                <PieIcon className="w-8 h-8 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {viewMode === 'global' ? 'Platform Volume' : 'System Volume'}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest leading-relaxed">
                  Distribution Across Time Periods
                </p>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total" stroke="none">
                      {analytics?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 text-center">
                <p className="text-3xl font-black text-white tracking-widest">${totalVolume.toLocaleString()}</p>
                <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.3em] mt-1">
                  {viewMode === 'global' ? 'Total Platform Throughput' : 'Total Personal Throughput'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Drill-Down View */}
          <AnimatePresence>
            {activeMonth && (
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="space-y-8 bg-indigo-600/5 p-10 rounded-[48px] border border-indigo-500/20 shadow-2xl shadow-indigo-600/5"
              >
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-300">
                        Monthly Drill-Down: {format(parseISO(activeMonth + "-01"), 'MMMM yyyy')}
                      </h2>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Displaying filtered records for the selected period</p>
                  </div>
                  <button 
                    onClick={() => setActiveMonth(null)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Clear Drill-Down
                  </button>
                </div>
                
                <TransactionTable />
                
                <div className="flex justify-center pt-6">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 hover:text-white transition-all group">
                    Visit full Unified Ledger <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
