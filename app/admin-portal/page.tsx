'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bell, Calendar, Image, Trophy, Users } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/shared';

type DashboardStats = {
  members: number;
  events: number;
  seasons: number;
  announcements: number;
  gallery: number;
};

const EMPTY_STATS: DashboardStats = { members: 0, events: 0, seasons: 0, announcements: 0, gallery: 0 };

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const endpoints = ['all-members', 'events', 'seasons', 'announcements', 'gallery'];
        const responses = await Promise.all(endpoints.map((endpoint) => fetch(`/api/data/${endpoint}`)));
        if (responses.some((response) => !response.ok)) throw new Error('Dashboard request failed');
        const [members, events, seasons, announcements, gallery] = await Promise.all(responses.map((response) => response.json()));
        setStats({
          members: members.length,
          events: events.length,
          seasons: seasons.length,
          announcements: announcements.length,
          gallery: gallery.length,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const records = [
    { label: 'Members', value: stats.members, icon: Users, href: '/admin-portal/members' },
    { label: 'Events', value: stats.events, icon: Calendar, href: '/admin-portal/events' },
    { label: 'Seasons', value: stats.seasons, icon: Trophy, href: '/admin-portal/league' },
    { label: 'Updates', value: stats.announcements, icon: Bell, href: '/admin-portal/announcements' },
    { label: 'Media', value: stats.gallery, icon: Image, href: '/admin-portal/gallery' },
  ];

  const actions = [
    { index: '01', label: 'Register tournament participants', detail: 'Add the confirmed players to the active FIFA season.', href: '/admin-portal/league' },
    { index: '02', label: 'Publish the fixture list', detail: 'Schedule rounds, dates and player matchups.', href: '/admin-portal/league' },
    { index: '03', label: 'Update community events', detail: 'Keep upcoming sessions and tournament dates current.', href: '/admin-portal/events' },
  ];

  return (
    <div>
      <AdminPageHeader title="Overview" description="A compact view of the records currently published across the community site." />

      {error && (
        <div className="mb-6 border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Some totals could not be loaded. The management pages are still available below.
        </div>
      )}

      <section aria-label="Published record totals" className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
        {records.map((record) => (
          <Link key={record.label} href={record.href} className="group bg-card p-5 transition-colors hover:bg-secondary/50">
            <div className="flex items-start justify-between">
              <record.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-8 font-orbitron text-2xl font-semibold">{loading ? '—' : record.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{record.label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Tournament setup</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Ready the next competition.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Work through the live data in the order it will be published.</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {actions.map((action) => (
            <Link key={action.index} href={action.href} className="group grid gap-3 border-b border-border px-5 py-5 last:border-b-0 sm:grid-cols-[40px_1fr_auto] sm:items-center">
              <span className="font-orbitron text-[10px] text-muted-foreground">{action.index}</span>
              <div><h3 className="text-sm font-semibold">{action.label}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{action.detail}</p></div>
              <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
