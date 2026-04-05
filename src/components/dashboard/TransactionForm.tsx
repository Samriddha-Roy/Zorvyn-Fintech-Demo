'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useData';
import { motion } from 'framer-motion';
import { Plus, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const transactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(2, 'Category name required'),
  date: z.string(),
  notes: z.string().optional(),
});

interface Props {
  onClose: () => void;
  initialData?: Transaction;
}

export default function TransactionForm({ onClose, initialData }: Props) {
  const isEdit = !!initialData;
  const { mutate: createTx, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: initialData ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      type: (initialData?.type || 'EXPENSE') as 'INCOME' | 'EXPENSE',
      amount: initialData?.amount || 0,
      category: initialData?.category || '',
      notes: initialData?.notes || '',
    }
  });

  const currentType = watch('type');

  const onSubmit = (data: any) => {
    const payload = { ...data, date: new Date(data.date).toISOString() };
    if (isEdit && initialData) {
      updateTx({ id: initialData.id, ...payload }, { onSuccess: () => onClose() });
    } else {
      createTx(payload, { onSuccess: () => onClose() });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tighter">
            {isEdit ? 'Update Record' : 'Add Transaction'}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">
            Admin Command Center
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Type</Label>
              <Select value={currentType} onValueChange={(val) => setValue('type', val as 'INCOME' | 'EXPENSE')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Magnitude</Label>
              <Input type="number" step="0.01" {...register('amount')} placeholder="0.00" />
              {errors.amount && <p className="text-[9px] text-destructive font-bold">{errors.amount.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Category / Project</Label>
            <Input {...register('category')} placeholder="e.g. AWS Hosting, Project Alpha" />
            {errors.category && <p className="text-[9px] text-destructive font-bold">{errors.category.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Log Date</Label>
            <Input type="date" {...register('date')} />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Internal Notes (Optional)</Label>
            <Input {...register('notes')} placeholder="Describe transaction context..." />
          </div>

          <Button type="submit" disabled={isPending} className="w-full font-black uppercase tracking-widest text-xs" size="lg">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEdit ? (
              <><Save className="w-4 h-4 mr-2" /> Commit Changes</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" /> Finalize Record</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
