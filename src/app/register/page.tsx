'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Loader2, KeyRound, User as UserIcon, Shield, Search, Eye } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).default('VIEWER'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'VIEWER'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/40 p-8 md:p-12 rounded-[40px] border border-slate-800/60 shadow-2xl backdrop-blur-2xl relative z-10 my-8"
      >
        <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-indigo-600/20 p-3 rounded-2xl mb-4">
              <Zap className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Initialize Identity</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Select your clearance level and join ZORVYN</p>
        </div>

        {error && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-xs font-black border border-rose-500/20 mb-6 uppercase tracking-widest">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Identity Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
              <input 
                {...register('firstName')}
                placeholder="Alex"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium"
              />
              {errors.firstName && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
              <input 
                {...register('lastName')}
                placeholder="Zorvyn"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium"
              />
              {errors.lastName && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.lastName.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
            <input 
              {...register('email')}
              placeholder="alex@zorvyn.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium"
            />
            {errors.email && <p className="text-[9px] text-rose-500 font-bold ml-1 text-center">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Access Level (Simulation)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RoleOption 
                active={selectedRole === 'VIEWER'} 
                onClick={() => setValue('role', 'VIEWER')}
                icon={<Eye className="w-5 h-5" />}
                title="Viewer"
                desc="Read-only summary"
              />
              <RoleOption 
                active={selectedRole === 'ANALYST'} 
                onClick={() => setValue('role', 'ANALYST')}
                icon={<Search className="w-5 h-5" />}
                title="Analyst"
                desc="Logs & Analytics"
              />
              <RoleOption 
                active={selectedRole === 'ADMIN'} 
                onClick={() => setValue('role', 'ADMIN')}
                icon={<Shield className="w-5 h-5" />}
                title="Admin"
                desc="Full CRUD Logic"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
            <input 
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 transition-all outline-none font-medium text-center"
            />
            {errors.password && <p className="text-[9px] text-rose-500 font-bold text-center">{errors.password.message as string}</p>}
          </div>

          <button 
             disabled={loading}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Strategic Account'}
          </button>

          <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Already authorized? <Link href="/login" className="text-indigo-500 hover:text-indigo-400">Log In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function RoleOption({ active, onClick, icon, title, desc }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-2 ${active ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
    >
      <div className={`${active ? 'text-indigo-400' : 'text-slate-600'} mb-1`}>{icon}</div>
      <h3 className={`text-xs font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-400'}`}>{title}</h3>
      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter leading-tight">{desc}</p>
    </div>
  );
}
