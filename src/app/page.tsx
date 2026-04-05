'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import SummaryCards from '@/components/dashboard/SummaryCards';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import TransactionTable from '@/components/dashboard/TransactionTable';
import TransactionForm from '@/components/dashboard/TransactionForm';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import { Plus, ShieldCheck, Lock, Activity, BarChart3, Receipt } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = (user?.role as UserRole) || 'VIEWER';
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const canViewReports = role === 'ANALYST' || role === 'ADMIN';
  const canManageData = role === 'ADMIN';

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 px-2">
        <div className="space-y-4">
           <div className="flex items-center gap-3 bg-indigo-600/10 w-fit px-4 py-1.5 rounded-full border border-indigo-500/20">
             <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Secure Environment</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Hub</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-sm">
             Logged in as: <span className="text-white font-black">{user?.firstName} {user?.lastName}</span> • Status: <span className="text-indigo-500">{role} MODE</span>
          </p>
        </div>

        {/* Global Admin Control Panel CTA */}
        {canManageData && (
          <button 
            onClick={() => setShowTransactionModal(true)}
            className="group bg-indigo-600 hover:bg-slate-100 hover:text-indigo-600 text-white font-black px-8 py-5 rounded-[24px] transition-all duration-500 shadow-2xl shadow-indigo-600/30 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px]"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            Generate Record
          </button>
        )}
      </header>

      {/* READ-ONLY SUMMARY (All Roles) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <Activity className="w-4 h-4 text-emerald-500" />
           <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Live Telemetry Summary</h2>
        </div>
        <SummaryCards />
      </section>

      {/* DYNAMIC CONTENT SECTIONS */}
      <div className="grid grid-cols-1 gap-12">
        
        {/* ANALYTICS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Trend Intelligence</h2>
            </div>
          </div>
          {canViewReports ? (
            <AnalyticsChart />
          ) : (
             <PlaceholderCard 
               icon={<BarChart3 className="w-10 h-10" />} 
               title="Charts Restricted" 
               desc="Visual trend analysis requires Analyst or Admin clearance." 
             />
          )}
        </section>

        {/* TRANSACTION LEDGER SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Receipt className="w-4 h-4 text-indigo-500" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Secure Ledger Logs</h2>
            </div>
            {!canViewReports && (
               <span className="flex items-center gap-2 text-[9px] font-black text-rose-500/80 uppercase tracking-widest bg-rose-500/5 px-3 py-1 rounded-full border border-rose-500/10">
                 <Lock className="w-3 h-3" /> Encrypted Data
               </span>
            )}
          </div>
          
          {canViewReports ? (
            <TransactionTable />
          ) : (
            <PlaceholderCard 
              icon={<Lock className="w-10 h-10" />} 
              title="Ledger Access Denied" 
              desc="The detailed transaction log is strictly restricted to cleared personnel." 
              locked
            />
          )}
        </section>

      </div>

      {/* Administrative Modals */}
      <AnimatePresence>
        {showTransactionModal && (
          <TransactionForm onClose={() => setShowTransactionModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderCard({ icon, title, desc, locked }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden p-16 md:p-24 border rounded-[40px] text-center group bg-slate-900/10 ${locked ? 'border-dashed border-rose-500/20' : 'border-dashed border-slate-800'}`}
    >
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -z-10 ${locked ? 'bg-rose-600/5' : 'bg-indigo-600/5'}`} />
      <div className={`mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 ${locked ? 'text-rose-500/30' : 'text-slate-700'}`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-black mb-3 tracking-tighter ${locked ? 'text-rose-500/60' : 'text-slate-400'}`}>{title}</h3>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
