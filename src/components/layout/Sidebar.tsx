'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, BarChart3, Settings, ShieldAlert, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const role = user?.role as UserRole;

  // Do not render sidebar on auth pages
  const isAuthPage = ['/login', '/register'].includes(pathname);
  if (isAuthPage || !isAuthenticated) return null;

  const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
    { label: 'Transactions', icon: Receipt, href: '/transactions', roles: ['ANALYST', 'ADMIN'] },
    { label: 'Analytics', icon: BarChart3, href: '/analytics', roles: ['ANALYST', 'ADMIN'] },
    { label: 'Admin Panel', icon: ShieldAlert, href: '/admin', roles: ['ADMIN'] },
    { label: 'Settings', icon: Settings, href: '/settings', roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
  ];

  const filteredRoutes = routes.filter(route => route.roles.includes(role));

  return (
    <aside className={cn("w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col p-6 sticky top-0 transition-all duration-500", className)}>
      <div className="flex items-center gap-3 mb-10 group">
        <div className="bg-indigo-600/20 p-2 rounded-lg group-hover:bg-indigo-600/30 transition-colors">
          <Zap className="w-6 h-6 text-indigo-500" />
        </div>
        <span className="font-black text-xl tracking-tighter text-white">ZORVYN</span>
      </div>

      <nav className="flex-1 space-y-1">
        <AnimatePresence mode="wait">
          {filteredRoutes.map((route, idx) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:text-white hover:bg-slate-900/50",
                  pathname === route.href && "bg-indigo-600/10 text-indigo-400 font-black shadow-sm shadow-indigo-600/5"
                )}
              >
                <route.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === route.href && "text-indigo-500")} />
                <span className="text-sm">{route.label}</span>
                {pathname === route.href && (
                  <motion.div layoutId="nav-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      <div className="pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-2 mb-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs uppercase shadow-lg shadow-indigo-600/20">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[9px] text-indigo-500 font-extrabold uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit System</span>
        </button>
      </div>
    </aside>
  );
}
