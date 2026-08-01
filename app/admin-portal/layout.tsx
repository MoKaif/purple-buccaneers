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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg glass"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 glass-strong border-r border-border/50 z-40 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Skull className="h-6 w-6 text-primary" />
            <span className="font-orbitron font-bold text-sm">
              <span className="text-primary">Admin</span> Portal
            </span>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-border/50">
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
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {children}
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
