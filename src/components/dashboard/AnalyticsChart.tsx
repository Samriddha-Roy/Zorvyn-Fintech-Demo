'use client';

import { useAnalytics } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsChart() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return <div className="h-64 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800 mb-8" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-sm mb-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-white">Monthly Breakdown</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-xs font-bold text-slate-400">Income</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-700" /><span className="text-xs font-bold text-slate-400">Expense</span></div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
            />
            <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`} 
            />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
