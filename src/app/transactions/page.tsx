'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useData';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isPlaceholderData } = useTransactions({
    search: debouncedSearch,
    type: typeFilter,
    page,
    limit,
  });

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
             <div className="bg-indigo-600/20 p-2 rounded-xl">
               <Receipt className="w-8 h-8 text-indigo-500" />
             </div>
             Unified Ledger
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">
            Browse and search your entire transaction history
          </p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-[24px] border border-slate-800/80 backdrop-blur-xl">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search categories or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 outline-none font-medium transition-all"
          />
        </div>
        
        <div className="relative">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <select 
             value={typeFilter}
             onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
             className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold appearance-none cursor-pointer"
           >
             <option value="">All Types</option>
             <option value="INCOME">Incomes</option>
             <option value="EXPENSE">Expenses</option>
           </select>
        </div>

        <div className="flex items-center justify-end gap-2 px-2">
            {isLoading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Records: {data?.meta?.total || 0}
            </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={`${debouncedSearch}-${typeFilter}-${page}`}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
           <TransactionTable />
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-8 mt-8 px-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Showing Page {page} of {totalPages}
          </p>
          
          <div className="flex items-center gap-3">
             <button 
               disabled={page === 1 || isLoading}
               onClick={() => setPage(prev => Math.max(1, prev - 1))}
               className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                <ChevronLeft className="w-5 h-5 text-white" />
             </button>
             
             <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i+1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 border border-slate-800 text-slate-500 hover:border-indigo-500'}`}
                    >
                        {i + 1}
                    </button>
                )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
             </div>

             <button 
               disabled={page === totalPages || isLoading}
               onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
               className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                <ChevronRight className="w-5 h-5 text-white" />
             </button>
          </div>
      </div>
    </div>
  );
}
