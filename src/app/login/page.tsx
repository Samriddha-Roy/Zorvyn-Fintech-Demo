'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.accessToken, res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authorization failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 p-6 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/40 p-10 rounded-[32px] border border-slate-800/60 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-indigo-600/20 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-600/10">
              <Zap className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Strategic Access</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Connect to ZORVYN Dashboard</p>
        </div>

        {error && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-xs font-black border border-rose-500/20 mb-6 uppercase tracking-widest">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                {...register('email')}
                placeholder="alex@zorvyn.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium"
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Authentication Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium"
              />
            </div>
            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password.message as string}</p>}
          </div>

          <button 
             disabled={loading}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Identity'}
          </button>

          <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-6">
            New Stratetgist? <Link href="/register" className="text-indigo-500 hover:text-indigo-400">Sign Up</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
