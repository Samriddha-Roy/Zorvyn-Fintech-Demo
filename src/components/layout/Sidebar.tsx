'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, BarChart3, Settings, ShieldAlert, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const role = user?.role as UserRole;

  const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
    { label: 'Transactions', icon: Receipt, href: '/transactions', roles: ['ANALYST', 'ADMIN'] },
    { label: 'Analytics', icon: BarChart3, href: '/analytics', roles: ['ANALYST', 'ADMIN'] },
    { label: 'Admin Panel', icon: ShieldAlert, href: '/admin', roles: ['ADMIN'] },
    { label: 'Settings', icon: Settings, href: '/settings', roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
  ];

  const filteredRoutes = routes.filter(route => route.roles.includes(role));

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 group">
        <div className="bg-indigo-600/30 p-2 rounded-lg">
          <Zap className="w-6 h-6 text-indigo-500" />
        </div>
        <span className="font-black text-xl tracking-tighter text-white">ZORVYN</span>
      </div>

      <nav className="flex-1 space-y-1">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:text-white hover:bg-slate-900",
              pathname === route.href && "bg-indigo-600/10 text-indigo-400 font-bold"
            )}
          >
            <route.icon className={cn("w-5 h-5", pathname === route.href && "text-indigo-500")} />
            <span className="text-sm">{route.label}</span>
            {pathname === route.href && (
              <motion.div layoutId="marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
