'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useData';
import { motion } from 'framer-motion';
import { X, Plus, Loader2, DollarSign, Tag, Info, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/types';

const transactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(2, 'Category name required'),
  date: z.string(),
  notes: z.string().optional(),
});

interface Props {
  onClose: () => void;
  initialData?: Transaction; // Added for Edit Mode
}

export default function TransactionForm({ onClose, initialData }: Props) {
  const isEdit = !!initialData;
  const { mutate: createTx, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: initialData ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      type: initialData?.type || 'EXPENSE',
      amount: initialData?.amount || 0,
      category: initialData?.category || '',
      notes: initialData?.notes || '',
    }
  });

  const onSubmit = (data: any) => {
    const payload = {
        ...data,
        date: new Date(data.date).toISOString()
    };

    if (isEdit && initialData) {
        updateTx({ id: initialData.id, ...payload }, {
            onSuccess: () => onClose(),
        });
    } else {
        createTx(payload, {
            onSuccess: () => onClose(),
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-8 pb-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">
                {isEdit ? 'Update Record' : 'Add Transaction'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Admin Command Center</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
              <select 
                {...register('type')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold appearance-none cursor-pointer"
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Magnitude</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold"
                />
              </div>
              {errors.amount && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.amount.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category / Project</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                {...register('category')}
                placeholder="e.g. AWS Hosting, Project Alpha"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold"
              />
            </div>
            {errors.category && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.category.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Log Date</label>
            <input 
              type="date"
              {...register('date')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold uppercase tracking-tighter"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Internal Notes (Optional)</label>
            <div className="relative">
               <span className="absolute left-4 top-4 text-slate-600"><Info className="w-4 h-4" /></span>
               <textarea 
                {...register('notes')}
                placeholder="Describe transaction context..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 outline-none font-medium resize-none"
              />
            </div>
          </div>

          <button 
             disabled={isPending}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEdit ? (
                <><Save className="w-4 h-4" /> Commit Changes</>
            ) : (
                <><Plus className="w-4 h-4" /> Finalize Record</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
