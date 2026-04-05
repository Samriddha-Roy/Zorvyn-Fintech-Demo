'use client';

import { useUsers, useUpdateUserRole, useTransactions } from '@/hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, ShieldAlert, Zap, Loader2, MoreVertical, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';
import { format } from 'date-fns';

export default function AdminPage() {
  const { data: users, isLoading } = useUsers();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { data: txs } = useTransactions({ limit: 1 }); // Get total count

  const totalTransactions = txs?.meta?.total || 0;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 px-2">
        <div className="space-y-4">
          <div className="bg-rose-500/10 w-fit px-4 py-1.5 rounded-full border border-rose-500/20">
             <ShieldAlert className="w-3.5 h-3.5 text-rose-500 inline mr-2" />
             <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Security Clearance: LEVEL 3</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none flex items-center gap-6">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 italic">Panel</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-sm ml-1">
             Enterprise-wide user governance and role management
          </p>
        </div>
      </header>

      {/* System Pulse Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <StatCard title="Total Registered Identity" value={users?.length || 0} icon={<Users className="w-5 h-5 text-indigo-500" />} />
        <StatCard title="Total Platform Volume" value={totalTransactions} icon={<Zap className="w-5 h-5 text-emerald-500" />} />
      </div>

      {/* User Management Ledger */}
      <section className="bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px] -z-10" />
        
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-indigo-400" />
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Identity Management Ledger</h2>
           </div>
           {isLoading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">Identify</th>
                <th className="pb-6 text-slate-600 text-[10px] font-black uppercase tracking-widest">Email Node</th>
                <th className="pb-6 text-slate-600 text-[10px] font-black uppercase tracking-widest">Joined Timestamp</th>
                <th className="pb-6 text-slate-600 text-[10px] font-black uppercase tracking-widest text-center">Active Clearance</th>
                <th className="pb-6 text-slate-600 text-[10px] font-black uppercase tracking-widest text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              <AnimatePresence>
                {users?.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-900/30 transition-all duration-300"
                  >
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-indigo-400 text-xs">
                           {u.firstName?.[0]}{u.lastName?.[0]}
                         </div>
                         <div>
                            <p className="text-xs font-black text-white">{u.firstName} {u.lastName}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Internal ID: {u.id.slice(0, 8)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="py-6 text-xs font-medium text-slate-400">{u.email}</td>
                    <td className="py-6 text-xs font-medium text-slate-600">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="py-6">
                       <div className="flex justify-center">
                          <select 
                            defaultValue={u.role}
                            disabled={isUpdating}
                            onChange={(e) => updateRole({ id: u.id, role: e.target.value })}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-700 bg-slate-950 focus:border-indigo-500 outline-none cursor-pointer appearance-none transition-all ${u.role === 'ADMIN' ? 'text-rose-500 border-rose-500/20' : u.role === 'ANALYST' ? 'text-indigo-400 border-indigo-500/20' : 'text-slate-500'}`}
                          >
                             <option value="VIEWER">Viewer</option>
                             <option value="ANALYST">Analyst</option>
                             <option value="ADMIN">Admin</option>
                          </select>
                       </div>
                    </td>
                    <td className="py-6 text-right">
                       <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
    return (
      <div className="bg-slate-900/40 p-8 rounded-[32px] border border-slate-800 backdrop-blur-2xl flex items-center justify-between group">
        <div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">{title}</p>
           <h3 className="text-4xl font-black text-white tracking-widest group-hover:text-indigo-400 transition-colors uppercase">{value}</h3>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-2xl group-hover:scale-110 transition-transform">
           {icon}
        </div>
      </div>
    );
}
