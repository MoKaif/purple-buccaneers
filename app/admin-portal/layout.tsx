'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Home, Bell, Calendar, Users, Trophy,
  Image, Award, Settings, LogOut, Skull, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';

const sidebarLinks = [
  { href: '/admin-portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin-portal/homepage', label: 'Homepage Content', icon: Home },
  { href: '/admin-portal/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin-portal/events', label: 'Events', icon: Calendar },
  { href: '/admin-portal/members', label: 'Members', icon: Users },
  { href: '/admin-portal/league', label: 'League', icon: Trophy },
  { href: '/admin-portal/gallery', label: 'Gallery', icon: Image },
  { href: '/admin-portal/hall-of-fame', label: 'Hall of Fame', icon: Award },
  { href: '/admin-portal/settings', label: 'Settings', icon: Settings },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isAuthed, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthed && pathname !== '/admin-portal/login') {
      router.push('/admin-portal/login');
    }
  }, [isAuthed, pathname, router]);

  if (pathname === '/admin-portal/login') {
    return <>{children}</>;
  }

  if (!isAuthed) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin-portal/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md border border-border bg-card p-2 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close admin navigation' : 'Open admin navigation'}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-0 z-40 w-64 border-r border-border bg-[#0d0b12] transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center gap-3 border-b border-border px-2 pb-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white"><Skull className="h-5 w-5" /></span>
            <div>
              <span className="block text-sm font-semibold">Purple Buccaneers</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operations</span>
            </div>
          </div>

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
          <nav className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  );
}
