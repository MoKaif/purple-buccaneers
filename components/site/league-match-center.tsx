'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronRight, Crown, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/site/glass-card';
import { FormIndicator } from '@/components/site/form-indicator';
import type { LeagueMatch, LeaguePlayer, LeagueSeason, StandingRow } from '@/lib/types';

interface LeagueMatchCenterProps {
  season: LeagueSeason | null;
  players: LeaguePlayer[];
  matches: LeagueMatch[];
  standings: StandingRow[];
}

function formatDate(value: string | null) {
  if (!value) return 'Date TBA';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function LeagueMatchCenter({ season, players, matches, standings }: LeagueMatchCenterProps) {
  const playerById = new Map(players.map((player) => [player.id, player]));
  const nextMatch = matches.find((match) => match.status === 'scheduled');
  const recentMatches = matches.filter((match) => match.status === 'completed').slice(-3).reverse();
  const topThree = standings.slice(0, 3);

  return (
    <GlassCard hover={false} className="overflow-hidden p-0">
      <div className="border-b border-border/60 bg-primary/[0.06] px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Trophy className="h-4 w-4" /> League match center
            </div>
            <h2 className="font-orbitron text-xl font-bold sm:text-2xl">{season?.name || 'League central'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Week {season?.current_week || 1} snapshot from the latest results.
            </p>
          </div>
          <Link href="/league">
            <Button variant="outline" size="sm" className="border-border hover:bg-white/5">
              Full league <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Table leaders</h3>
            <span className="text-xs text-muted-foreground">P / PTS</span>
          </div>
          {topThree.length ? (
            <div className="space-y-2">
              {topThree.map((row, index) => (
                <div key={row.playerId} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-400/15 text-yellow-300' : index === 1 ? 'bg-slate-300/15 text-slate-200' : 'bg-orange-400/15 text-orange-300'}`}>
                    {index + 1}
                  </span>
                  {row.avatarUrl ? <img src={row.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{row.username[0]}</div>}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{row.username}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{row.played} / <strong className="text-foreground">{row.points}</strong></span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">Standings will appear after the first completed match.</div>
          )}
        </div>

        <div className="border-t border-border/60 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Next fixture</h3>
          </div>
          {nextMatch ? (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Week {nextMatch.week}</span><span>{formatDate(nextMatch.match_date)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="max-w-[42%] truncate">{playerById.get(nextMatch.home_player_id || '')?.username || 'TBD'}</span>
                <span className="font-orbitron text-xs text-primary">VS</span>
                <span className="max-w-[42%] truncate text-right">{playerById.get(nextMatch.away_player_id || '')?.username || 'TBD'}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">No fixture scheduled yet.</div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent form</h3>
            {standings[0] && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Crown className="h-3.5 w-3.5 text-yellow-300" /> {standings[0].username}</span>}
          </div>
          <div className="mt-3 space-y-2">
            {recentMatches.length ? recentMatches.map((match) => {
              const home = playerById.get(match.home_player_id || '');
              const away = playerById.get(match.away_player_id || '');
              return <div key={match.id} className="flex items-center gap-2 text-xs"><Shield className="h-3.5 w-3.5 text-muted-foreground" /><span className="min-w-0 flex-1 truncate">{home?.username || 'TBD'} vs {away?.username || 'TBD'}</span><strong className="tabular-nums">{match.home_score}–{match.away_score}</strong></div>;
            }) : <div className="text-xs text-muted-foreground">No completed results yet.</div>}
          </div>
          {standings[0] && <div className="mt-3"><FormIndicator form={standings[0].form} /></div>}
        </div>
      </div>
    </GlassCard>
  );
}
