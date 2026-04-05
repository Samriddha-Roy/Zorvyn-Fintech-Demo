'use client';

import { useUsers, useUpdateUserRole, useTransactions } from '@/hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, ShieldAlert, Zap, Loader2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { data: users, isLoading } = useUsers();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { data: txs } = useTransactions({ limit: 1 });
  const totalTransactions = txs?.meta?.total || 0;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 px-2">
        <div className="space-y-4">
          <Badge variant="destructive" className="gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Security Clearance: LEVEL 3
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none flex items-center gap-6">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 italic">Panel</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] max-w-sm ml-1">
            Enterprise-wide user governance and role management
          </p>
        </div>
      </header>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-card/60 border-border group">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Registered Users</p>
              <h3 className="text-4xl font-black text-foreground tracking-widest group-hover:text-primary transition-colors">{users?.length || 0}</h3>
            </div>
            <div className="bg-accent p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-border group">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Platform Volume</p>
              <h3 className="text-4xl font-black text-foreground tracking-widest group-hover:text-emerald-500 transition-colors">{totalTransactions}</h3>
            </div>
            <div className="bg-accent p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card className="bg-card/60 border-border relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Identity Management Ledger</CardTitle>
          </div>
          {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Email</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Joined</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {users?.map((u, idx) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group border-border hover:bg-accent/50 transition-colors"
                    >
                      <TableCell className="py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                              {u.firstName?.[0]}{u.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-black text-foreground">{u.firstName} {u.lastName}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">ID: {u.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Select 
                            defaultValue={u.role || 'VIEWER'} 
                            disabled={isUpdating} 
                            onValueChange={(val) => { if (val) updateRole({ id: u.id, role: val }); }}
                          >
                            <SelectTrigger className="w-32 h-8 text-[9px] font-black uppercase tracking-widest">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                              <SelectItem value="ANALYST">Analyst</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
