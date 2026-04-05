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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      console.error('❌ Login error context:', err);
      const msg = err.response?.data?.message || err.message || 'Authorization failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 p-6 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-2xl border-border shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="bg-primary/20 p-3 rounded-2xl mx-auto mb-4 shadow-lg shadow-primary/10">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter">Strategic Access</CardTitle>
            <CardDescription className="font-bold uppercase tracking-widest text-[10px]">Connect to ZORVYN Dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-xs font-black border border-destructive/20 mb-6 uppercase tracking-widest">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">Email Terminal</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input {...register('email')} placeholder="alex@zorvyn.com" className="pl-10" />
                </div>
                {errors.email && <p className="text-[10px] text-destructive font-bold">{errors.email.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">Authentication Key</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" {...register('password')} placeholder="••••••••" className="pl-10" />
                </div>
                {errors.password && <p className="text-[10px] text-destructive font-bold">{errors.password.message as string}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full font-black uppercase tracking-widest text-xs" 
                size="lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Identity'}
              </Button>

              <p className="text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-6">
                New Strategist? <Link href="/register" className="text-primary hover:underline">Sign Up</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
