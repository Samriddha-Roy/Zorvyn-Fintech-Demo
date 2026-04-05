'use client';

import { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '@/hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, ShieldAlert, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { UserRole, Transaction } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import TransactionForm from './TransactionForm';

export default function TransactionTable() {
  const { data, isLoading } = useTransactions();
  const { mutate: deleteTx } = useDeleteTransaction();
  const { user } = useAuthStore();
  const role = user?.role as UserRole;
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Safely extract the transaction array from the paginated response
  const transactions = data?.data || [];
  const totalCount = data?.meta?.total || 0;

  if (isLoading) {
    return <div className="h-64 bg-slate-900/50 animate-pulse rounded-[32px] border border-slate-800" />;
  }

  return (
    <div className="bg-slate-950 p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">Enterprise Ledger</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">
            Real-time synchronization with ZORVYN Core
          </p>
        </div>
        
        {/* Role Mode Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${role === 'ADMIN' ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          {role === 'ADMIN' ? (
            <><Zap className="w-3 h-3" /> CRUD Mode Active</>
          ) : (
            <><Eye className="w-3 h-3" /> Read-Only View Mode</>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="pb-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
              <th className="pb-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Categorization</th>
              <th className="pb-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Type</th>
              <th className="pb-4 text-slate-600 text-[10px] font-black uppercase tracking-widest text-right">Value</th>
              {role === 'ADMIN' && <th className="pb-4 text-slate-600 text-[10px] font-black uppercase tracking-widest text-center">Operations</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            <AnimatePresence>
              {transactions.map((tx, idx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-slate-900/30 transition-all duration-300"
                >
                  <td className="py-5 text-sm font-medium text-slate-500">
                    {format(new Date(tx.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-5 text-sm font-bold text-white group-hover:text-indigo-400 transition-colors capitalize">{tx.category}</td>
                  <td className="py-5">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-5 text-sm font-black text-right ${tx.type === 'INCOME' ? 'text-emerald-400/80' : 'text-white'}`}>
                    ${tx.amount.toLocaleString()}
                  </td>
                  {role === 'ADMIN' && (
                    <td className="py-5">
                      <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => setEditingTransaction(tx)}
                          className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteTx(tx.id)}
                          className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="py-20 text-center">
            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Zero records found in local ledger</p>
        </div>
      )}

      {totalCount > 0 && (
        <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">
            <span>Total Records: {totalCount}</span>
            <span>Refreshed {format(new Date(), 'HH:mm:ss')}</span>
        </div>
      )}

      {/* Admin Edit Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <TransactionForm 
            initialData={editingTransaction} 
            onClose={() => setEditingTransaction(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
