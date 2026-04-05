import './globals.css';
import { Inter } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import Sidebar from '@/components/layout/Sidebar';
import AuthGuard from '@/components/auth/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ZORVYN Finance | Premium Dashboard',
  description: 'Enterprise financial management SaaS interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex`}>
        <QueryProvider>
          <AuthGuard>
            <SidebarWrapper>
              {children}
            </SidebarWrapper>
          </AuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}

// Wrapper component to conditionally hide sidebar on auth pages
function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex w-full">
        <Sidebar className="hidden md:flex shrink-0" />
        <main className="flex-1 overflow-y-auto max-w-7xl mx-auto w-full p-6 md:p-10 transition-all duration-300">
           {children}
        </main>
      </div>
    </>
  );
}
