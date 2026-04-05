'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, BarChart3, ShieldAlert, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const role = user?.role as UserRole;

  const isAuthPage = ['/login', '/register'].includes(pathname);
  if (isAuthPage || !isAuthenticated) return null;

  const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
    { label: 'Transactions', icon: Receipt, href: '/transactions', roles: ['ADMIN'] },
    { label: 'Analytics', icon: BarChart3, href: '/analytics', roles: ['ANALYST', 'ADMIN'] },
    { label: 'Admin Panel', icon: ShieldAlert, href: '/admin', roles: ['ADMIN'] },
  ];

  const filteredRoutes = routes.filter(route => route.roles.includes(role));

  return (
    <aside className={cn("w-64 h-screen bg-card/50 border-r border-border flex flex-col p-6 sticky top-0 transition-all duration-500", className)}>
      <div className="flex items-center gap-3 mb-10 group">
        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <span className="font-black text-xl tracking-tighter text-foreground">ZORVYN</span>
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
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-accent",
                      pathname === route.href && "bg-primary/10 text-primary font-black shadow-sm"
                    )}
                  >
                    <route.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === route.href && "text-primary")} />
                    <span className="text-sm">{route.label}</span>
                    {pathname === route.href && (
                      <motion.div layoutId="nav-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{route.label}</TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-2xl border border-border">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-foreground truncate">{user?.firstName} {user?.lastName}</p>
            <Badge variant="secondary" className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0">{user?.role}</Badge>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-black uppercase tracking-widest text-[10px]" onClick={clearAuth}>
          <LogOut className="w-4 h-4" />
          Exit System
        </Button>
      </div>
    </aside>
  );
}
