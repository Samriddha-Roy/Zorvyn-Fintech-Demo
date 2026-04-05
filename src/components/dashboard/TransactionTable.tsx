'use client';

import { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '@/hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { UserRole, Transaction } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import TransactionForm from './TransactionForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function TransactionTable() {
  const { data, isLoading } = useTransactions();
  const { mutate: deleteTx } = useDeleteTransaction();
  const { user } = useAuthStore();
  const role = user?.role as UserRole;
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const transactions = data?.data || [];
  const totalCount = data?.meta?.total || 0;

  if (isLoading) {
    return (
      <Card className="bg-card/60 border-border">
        <CardContent className="p-8 space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 border-border relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-black tracking-tighter">Enterprise Ledger</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">
            Real-time synchronization with ZORVYN Core
          </CardDescription>
        </div>
        <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="gap-1.5">
          {role === 'ADMIN' ? <><Zap className="w-3 h-3" /> CRUD Mode</> : <><Eye className="w-3 h-3" /> Read-Only</>}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Timestamp</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Type</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Value</TableHead>
              {role === 'ADMIN' && <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {transactions.map((tx, idx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group border-border hover:bg-accent/50 transition-colors"
                >
                  <TableCell className="text-sm font-medium text-muted-foreground">
                    {format(new Date(tx.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-foreground capitalize group-hover:text-indigo-400 transition-colors">
                    {tx.category}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'INCOME' ? 'outline' : 'destructive'} className={`text-[9px] font-black uppercase ${tx.type === 'INCOME' ? 'border-emerald-500/30 text-emerald-500' : ''}`}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-sm font-black text-right ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-foreground'}`}>
                    ${tx.amount.toLocaleString()}
                  </TableCell>
                  {role === 'ADMIN' && (
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingTransaction(tx)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit transaction</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => deleteTx(tx.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete transaction</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {transactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Zero records found</p>
          </div>
        )}

        {totalCount > 0 && (
          <div className="p-4 flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border">
            <span>Total Records: {totalCount}</span>
            <span>Refreshed {format(new Date(), 'HH:mm:ss')}</span>
          </div>
        )}
      </CardContent>

      <AnimatePresence>
        {editingTransaction && (
          <TransactionForm initialData={editingTransaction} onClose={() => setEditingTransaction(null)} />
        )}
      </AnimatePresence>
    </Card>
  );
}
