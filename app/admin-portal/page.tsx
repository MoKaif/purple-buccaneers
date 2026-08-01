'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Bell, Image, Award, Settings, ArrowRight, Activity } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, events: 0, seasons: 0, announcements: 0, gallery: 0, hallOfFame: 0 });

  useEffect(() => {
    (async () => {
      const [m, e, s, a, g, h] = await Promise.all([
        fetch('/api/data/all-members').then((r) => r.json()),
        fetch('/api/data/events').then((r) => r.json()),
        fetch('/api/data/seasons').then((r) => r.json()),
        fetch('/api/data/announcements').then((r) => r.json()),
        fetch('/api/data/gallery').then((r) => r.json()),
        fetch('/api/data/hall-of-fame').then((r) => r.json()),
      ]);
      setStats({
        members: m.length,
        events: e.length,
        seasons: s.length,
        announcements: a.length,
        gallery: g.length,
        hallOfFame: h.length,
      });
    })();
  }, []);

  const cards = [
    { label: 'Members', value: stats.members, icon: Users, href: '/admin-portal/members' },
    { label: 'Events', value: stats.events, icon: Calendar, href: '/admin-portal/events' },
    { label: 'Seasons', value: stats.seasons, icon: Trophy, href: '/admin-portal/league' },
    { label: 'Announcements', value: stats.announcements, icon: Bell, href: '/admin-portal/announcements' },
    { label: 'Gallery Items', value: stats.gallery, icon: Image, href: '/admin-portal/gallery' },
    { label: 'Hall of Fame', value: stats.hallOfFame, icon: Award, href: '/admin-portal/hall-of-fame' },
  ];

  const quickLinks = [
    { label: 'Edit Homepage', desc: 'Update welcome message & stats', icon: Settings, href: '/admin-portal/homepage' },
    { label: 'Manage Members', desc: 'Add or edit crew members', icon: Users, href: '/admin-portal/members' },
    { label: 'Create Event', desc: 'Schedule a new community event', icon: Calendar, href: '/admin-portal/events' },
    { label: 'Enter Match Results', desc: 'Update league standings', icon: Trophy, href: '/admin-portal/league' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-orbitron text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-8">Welcome back, Captain. Here is your community overview.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={card.href}>
              <GlassCard className="hover:border-primary/30 transition-all cursor-pointer">
                <card.icon className="h-6 w-6 text-primary mb-3" />
                <div className="font-orbitron text-2xl font-bold">{card.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <h2 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" /> Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link, i) => (
          <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={link.href}>
              <GlassCard className="group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-1">
                      {link.label}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h4>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
