import './globals.css';
import { Inter, Geist } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import Sidebar from '@/components/layout/Sidebar';
import AuthGuard from '@/components/auth/AuthGuard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex`}>
        <QueryProvider>
          <TooltipProvider>
            <AuthGuard>
              <SidebarWrapper>
                {children}
              </SidebarWrapper>
            </AuthGuard>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

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
