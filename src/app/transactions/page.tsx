'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useData';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Search, ChevronLeft, ChevronRight, Loader2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useTransactions({
    search: debouncedSearch || undefined,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
    page,
    limit,
  });

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-foreground tracking-tighter flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl"><Receipt className="w-8 h-8 text-primary" /></div>
          Unified Ledger
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">
          Browse and search your entire transaction history
        </p>
      </header>

      {/* Filter Bar */}
      <Card className="bg-card/60 border-border">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={(val: string | null) => { if (val) { setTypeFilter(val); setPage(1); } }}>
            <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INCOME">Incomes</SelectItem>
              <SelectItem value="EXPENSE">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-end gap-2 px-2">
            {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">
              Records: {data?.meta?.total || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

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

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8 mt-8 px-4">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" disabled={page === 1 || isLoading} onClick={() => setPage(prev => Math.max(1, prev - 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i+1} variant={page === i + 1 ? 'default' : 'outline'} size="icon" onClick={() => setPage(i + 1)} className="w-10 h-10 text-xs font-black">
              {i + 1}
            </Button>
          )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
          <Button variant="outline" size="icon" disabled={page === totalPages || isLoading} onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
