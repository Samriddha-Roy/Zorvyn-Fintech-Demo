'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Loader2, Shield, Search, Eye } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    defaultValues: { role: 'VIEWER' as const }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      setTimeout(() => router.push('/login'), 1000);
    } catch (err: any) {
      console.error('❌ Registration error context:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-2xl border-border shadow-2xl my-8">
          <CardHeader className="text-center pb-6">
            <div className="bg-primary/20 p-3 rounded-2xl mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter">Initialize Identity</CardTitle>
            <CardDescription className="font-bold uppercase tracking-widest text-[10px]">Select your clearance level and join ZORVYN</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-xs font-black border border-destructive/20 mb-6 uppercase tracking-widest">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">First Name</Label>
                  <Input {...register('firstName')} placeholder="Alex" />
                  {errors.firstName && <p className="text-[9px] text-destructive font-bold">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Last Name</Label>
                  <Input {...register('lastName')} placeholder="Zorvyn" />
                  {errors.lastName && <p className="text-[9px] text-destructive font-bold">{errors.lastName.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">Email Terminal</Label>
                <Input {...register('email')} placeholder="alex@zorvyn.com" />
                {errors.email && <p className="text-[9px] text-destructive font-bold">{errors.email.message as string}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest">Select Access Level</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RoleOption active={selectedRole === 'VIEWER'} onClick={() => setValue('role', 'VIEWER')} icon={<Eye className="w-5 h-5" />} title="Viewer" desc="Read-only summary" />
                  <RoleOption active={selectedRole === 'ANALYST'} onClick={() => setValue('role', 'ANALYST')} icon={<Search className="w-5 h-5" />} title="Analyst" desc="Logs & Analytics" />
                  <RoleOption active={selectedRole === 'ADMIN'} onClick={() => setValue('role', 'ADMIN')} icon={<Shield className="w-5 h-5" />} title="Admin" desc="Full CRUD Logic" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">Security Key</Label>
                <Input type="password" {...register('password')} placeholder="••••••••" />
                {errors.password && <p className="text-[9px] text-destructive font-bold">{errors.password.message as string}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full font-black uppercase tracking-widest text-xs" 
                size="lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Strategic Account'}
              </Button>

              <p className="text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                Already authorized? <Link href="/login" className="text-primary hover:underline">Log In</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function RoleOption({ active, onClick, icon, title, desc }: any) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 text-center hover:scale-[1.02] ${active ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-card hover:border-muted-foreground/30'}`}
    >
      <CardContent className="p-4 flex flex-col items-center gap-2">
        <div className={`${active ? 'text-primary' : 'text-muted-foreground'} mb-1`}>{icon}</div>
        <h3 className={`text-xs font-black uppercase tracking-widest ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h3>
        <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter leading-tight">{desc}</p>
      </CardContent>
    </Card>
  );
}
