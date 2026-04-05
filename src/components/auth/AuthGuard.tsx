'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, ShieldCheck, LockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, updateUser, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const revalidationTriggered = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verification Logic: Sync with the database on reload
  useEffect(() => {
    const validateSession = async () => {
      // Re-check existence and role
      if (token && !revalidationTriggered.current) {
        revalidationTriggered.current = true;
        try {
          const { data } = await api.get('/users/me');
          updateUser(data); // Refresh the latest Role
        } catch (error) {
          console.error("Session integrity compromised (user removed or role changed). Logging out.");
          clearAuth();
          router.push('/login');
        } finally {
          setIsValidating(false);
        }
      } else if (!token) {
        setIsValidating(false);
      }
    };

    if (mounted) {
       validateSession();
    }
  }, [mounted, token, updateUser, clearAuth, router]);

  // Redirection Logic
  useEffect(() => {
    if (mounted && !isValidating) {
      const publicPaths = ['/login', '/register'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!isAuthenticated && !isPublicPath) {
        router.push('/login');
      } else if (isAuthenticated && isPublicPath) {
        router.push('/');
      }
    }
  }, [isAuthenticated, pathname, router, mounted, isValidating]);

  // Loading Screen for Secure Mounting
  if (!mounted || isValidating) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-6">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800"
        >
            <LockIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.3em]">Initialising Secure Fault</span>
        </motion.div>
        
        <div className="relative">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
        
        <p className="text-slate-600 font-bold uppercase tracking-widest text-[9px] animate-pulse">Syncing permissions with ZORVYN Ledger...</p>
      </div>
    );
  }

  return <>{children}</>;
}
