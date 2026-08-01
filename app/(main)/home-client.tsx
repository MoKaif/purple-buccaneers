'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Trophy, Users, Activity, Calendar, Gamepad2, Award, Zap, Target,
  TrendingUp, ArrowRight, Skull, Star, Shield, Crown, Film, Swords, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/site/glass-card';
import { BadgeList } from '@/components/site/badge';
import { FormIndicator } from '@/components/site/form-indicator';
import { calculateStandings } from '@/lib/standings';
import type { Settings, Member, Announcement, EventItem, LeagueSeason, LeaguePlayer, LeagueMatch } from '@/lib/types';
import type { DiscordStats } from '@/lib/discord';

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  crown: Crown,
  shield: Shield,
  star: Star,
  film: Film,
  swords: Swords,
  users: Users,
  activity: Activity,
  bell: Bell,
};

const typeColors: Record<string, string> = {
  match_result: 'text-success bg-success/10',
  event: 'text-blue-400 bg-blue-400/10',
  tournament: 'text-yellow-400 bg-yellow-400/10',
  update: 'text-primary bg-primary/10',
};

interface HomeClientProps {
  settings: Settings | null;
  members: Member[];
  announcements: Announcement[];
  featuredEvent: EventItem | null;
  season: LeagueSeason | null;
  players: LeaguePlayer[];
  matches: LeagueMatch[];
  discord: DiscordStats;
  discordUrl: string;
}

export function HomeClient({
  settings,
  members,
  announcements,
  featuredEvent,
  season,
  players,
  matches,
  discord,
  discordUrl,
}: HomeClientProps) {
  const standings = calculateStandings(matches, players);
  const leader = standings[0] || null;
  const nextMatch = matches.find((m) => m.status === 'scheduled') || null;
  const nextMatchHome = players.find((p) => p.id === nextMatch?.home_player_id);
  const nextMatchAway = players.find((p) => p.id === nextMatch?.away_player_id);

  // Discord counts are live when the invite lookup succeeds; the stored
  // settings values are the fallback so the grid never renders empty.
  const stats = [
    {
      label: 'Members',
      value: discord.memberCount ?? settings?.stat_members ?? 18,
      icon: Users,
      live: discord.memberCount !== null,
    },
    {
      label: 'Online',
      value: discord.onlineCount ?? settings?.stat_online ?? 7,
      icon: Zap,
      live: discord.onlineCount !== null,
    },
    { label: 'Seasons', value: settings?.stat_seasons ?? 4, icon: Trophy, live: false },
    { label: 'Matches', value: settings?.stat_matches ?? 120, icon: Gamepad2, live: false },
    { label: 'Goals', value: settings?.stat_goals ?? 340, icon: Target, live: false },
    { label: 'Events', value: settings?.stat_events ?? 25, icon: Calendar, live: false },
  ];

  const quickNav = [
    { href: '/events', label: 'Events', desc: 'Upcoming community gatherings', icon: Calendar },
    { href: '/league', label: 'League', desc: 'FIFA League standings & fixtures', icon: Trophy },
    { href: '/gallery', label: 'Gallery', desc: 'Community moments & posters', icon: Star },
    { href: '/members', label: 'Members', desc: 'Meet the crew', icon: Users },
    { href: '/hall-of-fame', label: 'Hall of Fame', desc: 'Past season legends', icon: Crown },
    { href: '/about', label: 'About', desc: 'Our community story', icon: Skull },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full animate-glow-pulse" />
              <Skull className="relative h-20 w-20 text-primary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-glow"
          >
            <span className="text-primary">Purple</span> Buccaneers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {settings?.welcome_message || 'A premium gaming community. Events, leagues, and good company on the digital seas.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href={discordUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12 text-base">
                Join Discord
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/league">
              <Button size="lg" variant="outline" className="border-border hover:bg-white/5 px-8 h-12 text-base">
                View League
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Dashboard cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Featured Event + League Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Event */}
          <div className="lg:col-span-2">
            <GlassCard hover={false} className="h-full relative overflow-hidden p-0">
              {featuredEvent?.banner_url && (
                <div className="absolute inset-0">
                  <img src={featuredEvent.banner_url} alt="" className="w-full h-full object-cover opacity-20" />
                </div>
              )}
              <div className="relative p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
                    <Calendar className="h-3 w-3" /> Featured Event
                  </span>
                </div>
                <h3 className="font-orbitron text-2xl md:text-3xl font-bold mb-3">
                  {featuredEvent?.title || 'FIFA League Night'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg">
                  {featuredEvent?.description || 'Weekly FIFA League matches. Check in by 7:45 PM.'}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{featuredEvent ? new Date(featuredEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'TBD'}</span>
                  </div>
                  <Link href="/events">
                    <Button variant="outline" size="sm" className="border-border hover:bg-white/5">
                      View All Events <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* League Spotlight */}
          <div>
            <GlassCard hover={false} className="h-full">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-lg font-bold">League Spotlight</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-muted-foreground">Current Season</span>
                  <span className="font-semibold text-primary">{season?.name || 'Season 3'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-muted-foreground">League Leader</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    {leader?.username || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-muted-foreground">Current Week</span>
                  <span className="font-semibold">Week {season?.current_week || 4}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-muted-foreground block mb-2">Next Match</span>
                  {nextMatch ? (
                    <span className="font-semibold text-sm">
                      {nextMatchHome?.username || 'TBD'} vs {nextMatchAway?.username || 'TBD'}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No scheduled matches</span>
                  )}
                </div>
              </div>
              <Link href="/league">
                <Button variant="outline" size="sm" className="w-full mt-5 border-border hover:bg-white/5">
                  View League <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>

        {/* Community Stats */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-center">Community Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <GlassCard className="text-center">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                  <div className="font-orbitron text-2xl font-bold tabular-nums">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                    {stat.live && (
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse"
                        title="Live from Discord"
                      />
                    )}
                    {stat.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Latest Activity + Featured Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Activity */}
          <div>
            <h2 className="font-orbitron text-2xl font-bold mb-6">Latest Activity</h2>
            <GlassCard hover={false} className="space-y-4">
              {announcements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
              {announcements.slice(0, 6).map((item, i) => {
                const Icon = item.icon ? iconMap[item.icon] || Activity : Activity;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-lg ${typeColors[item.type] || typeColors.update}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < announcements.slice(0, 6).length - 1 && (
                        <div className="w-px flex-1 bg-border/50 mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </GlassCard>
          </div>

          {/* Featured Members */}
          <div>
            <h2 className="font-orbitron text-2xl font-bold mb-6">Featured Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.slice(0, 4).map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard className="text-center">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.username} className="relative w-16 h-16 rounded-full border-2 border-primary/30" />
                      ) : (
                        <div className="relative w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                          {member.username[0]}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold">{member.username}</h4>
                    <p className="text-xs text-primary mb-2">{member.role}</p>
                    {member.badges && member.badges.length > 0 && (
                      <BadgeList badges={member.badges.slice(0, 2)} className="justify-center" />
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-center">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickNav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={item.href}>
                  <GlassCard className="group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-1">
                          {item.label}
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
