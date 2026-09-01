'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Award, CalendarDays, ChevronRight, History, Shield, Target, Users } from 'lucide-react';
import { FormIndicator } from '@/components/site/form-indicator';
import { BadgeList } from '@/components/site/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateStandings, calculatePlayerStats } from '@/lib/standings';
import { cn } from '@/lib/utils';
import type { LeagueSeason, LeaguePlayer, LeagueMatch, PlayerStats } from '@/lib/types';

interface LeagueClientProps {
  seasons: LeagueSeason[];
  players: LeaguePlayer[];
  matches: LeagueMatch[];
  initialSeasonId: string | null;
}

function PlayerAvatar({ player, size = 'md' }: { player?: LeaguePlayer; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[10px]' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-9 w-9 text-xs';

  if (player?.avatar_url) {
    const pixels = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
    return <Image src={player.avatar_url} alt="" width={pixels} height={pixels} className={cn(sizeClass, 'shrink-0 rounded-full border border-white/10 object-cover')} />;
  }

  return (
    <span className={cn(sizeClass, 'flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-foreground')}>
      {player?.username?.slice(0, 1).toUpperCase() || '?'}
    </span>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 h-px w-10 bg-primary" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="min-w-0 border-l border-border px-4 first:border-l-0 first:pl-0 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function MatchRow({ match, playerMap, completed }: { match: LeagueMatch; playerMap: Map<string, LeaguePlayer>; completed: boolean }) {
  const home = match.home_player_id ? playerMap.get(match.home_player_id) : undefined;
  const away = match.away_player_id ? playerMap.get(match.away_player_id) : undefined;
  const matchDate = match.match_date ? new Date(match.match_date) : null;

  return (
    <article className="grid gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[120px_1fr_110px] sm:items-center sm:px-6">
      <div className="flex items-center justify-between sm:block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Week {match.week}</span>
        <p className="mt-1 text-xs text-muted-foreground">
          {matchDate ? matchDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date to be confirmed'}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-2 text-right">
          <span className="truncate text-sm font-medium">{home?.username || 'TBD'}</span>
          <PlayerAvatar player={home} size="sm" />
        </div>
        <div className={cn('min-w-16 text-center font-orbitron font-semibold', completed ? 'text-lg text-foreground' : 'text-xs text-muted-foreground')}>
          {completed ? `${match.home_score} : ${match.away_score}` : 'VS'}
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <PlayerAvatar player={away} size="sm" />
          <span className="truncate text-sm font-medium">{away?.username || 'TBD'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end">
        <span className="text-xs text-muted-foreground sm:hidden">Status</span>
        <span className={cn(
          'rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
          completed ? 'border-success/20 bg-success/10 text-success' : 'border-primary/20 bg-primary/10 text-primary'
        )}>
          {completed ? 'Final' : 'Scheduled'}
        </span>
      </div>
    </article>
  );
}

export function LeagueClient({ seasons, players, matches, initialSeasonId }: LeagueClientProps) {
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(initialSeasonId);
  const activeSeason = seasons.find((season) => season.id === activeSeasonId) || null;
  const seasonMatches = useMemo(
    () => activeSeasonId ? matches.filter((match) => match.season_id === activeSeasonId) : [],
    [activeSeasonId, matches]
  );
  const seasonPlayers = useMemo(
    () => activeSeasonId ? players.filter((player) => player.season_id === activeSeasonId) : [],
    [activeSeasonId, players]
  );
  const playerMap = useMemo(() => new Map(seasonPlayers.map((player) => [player.id, player])), [seasonPlayers]);
  const standings = calculateStandings(seasonMatches, seasonPlayers);
  const completedMatches = seasonMatches.filter((match) => match.status === 'completed');
  const fixtures = seasonMatches
    .filter((match) => match.status === 'scheduled')
    .sort((a, b) => (a.match_date || '').localeCompare(b.match_date || '') || a.week - b.week);
  const results = completedMatches.slice().sort((a, b) => (b.match_date || '').localeCompare(a.match_date || '') || b.week - a.week);
  const completedSeasons = seasons.filter((season) => season.status === 'completed');
  const playerStats = seasonPlayers
    .map((player) => calculatePlayerStats(player.id, seasonMatches, seasonPlayers))
    .filter((stats): stats is PlayerStats => Boolean(stats));
  const totalGoals = completedMatches.reduce((total, match) => total + match.home_score + match.away_score, 0);
  const topScorer = completedMatches.length ? playerStats.slice().sort((a, b) => b.goals - a.goals || b.wins - a.wins)[0] : null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Competition</span>
          <select
            value={activeSeason?.id || ''}
            onChange={(event) => setActiveSeasonId(event.target.value || null)}
            className="min-w-0 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold outline-none transition-colors focus:border-primary"
            aria-label="Select tournament season"
          >
            {seasons.length === 0 && <option value="">No seasons available</option>}
            {seasons.map((season) => <option key={season.id} value={season.id}>{season.name}{season.status === 'active' ? ' — Active' : ''}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {seasonPlayers.length} participants</span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Week {activeSeason?.current_week || 0}</span>
        </div>
      </div>

      {activeSeason ? (
        <>
          <div className="mb-8 grid grid-cols-2 gap-y-6 border-b border-border pb-8 md:grid-cols-4">
            <Metric label="Leader" value={standings[0]?.username || '—'} detail={`${standings[0]?.points || 0} points`} />
            <Metric label="Top scorer" value={topScorer?.username || '—'} detail={`${topScorer?.goals || 0} goals`} />
            <Metric label="Played" value={completedMatches.length} detail={`${fixtures.length} still scheduled`} />
            <Metric label="Goals" value={totalGoals} detail={completedMatches.length ? `${(totalGoals / completedMatches.length).toFixed(1)} per match` : 'No results yet'} />
          </div>

          <Tabs defaultValue="standings" className="w-full">
            <div className="mb-5 overflow-x-auto border-b border-border scrollbar-hide">
              <TabsList className="h-auto min-w-max justify-start gap-6 rounded-none bg-transparent p-0">
                {[
                  ['standings', 'Table'], ['fixtures', 'Fixtures'], ['results', 'Results'],
                  ['players', 'Participants'], ['stats', 'Numbers'], ['history', 'Archive'],
                ].map(([value, label]) => (
                  <TabsTrigger key={value} value={value} className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="standings" className="mt-0">
              <div className="overflow-hidden rounded-lg border border-border bg-card/50">
                <PanelHeader eyebrow="Current standings" title={activeSeason.name} detail="Three points for a win · one for a draw" />
                <div className="overflow-x-auto">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
                        <TableHead className="sticky left-0 z-10 w-12 bg-[#100d16] text-center">Pos</TableHead>
                        <TableHead className="sticky left-12 z-10 min-w-48 bg-[#100d16]">Participant</TableHead>
                        <TableHead className="text-center">P</TableHead><TableHead className="text-center">W</TableHead>
                        <TableHead className="text-center">D</TableHead><TableHead className="text-center">L</TableHead>
                        <TableHead className="text-center">GF</TableHead><TableHead className="text-center">GA</TableHead>
                        <TableHead className="text-center">GD</TableHead><TableHead className="text-center text-foreground">Pts</TableHead>
                        <TableHead>Last five</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standings.map((row, index) => (
                        <TableRow key={row.playerId} className="border-border/70 hover:bg-secondary/30">
                          <TableCell className="sticky left-0 z-10 bg-card text-center font-orbitron text-xs font-semibold"><span className={cn(index === 0 && 'text-primary')}>{String(index + 1).padStart(2, '0')}</span></TableCell>
                          <TableCell className="sticky left-12 z-10 bg-card"><div className="flex items-center gap-2.5"><PlayerAvatar player={playerMap.get(row.playerId)} size="sm" /><span className="font-medium">{row.username}</span></div></TableCell>
                          <TableCell className="text-center">{row.played}</TableCell><TableCell className="text-center">{row.wins}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.draws}</TableCell><TableCell className="text-center text-muted-foreground">{row.losses}</TableCell>
                          <TableCell className="text-center">{row.goalsFor}</TableCell><TableCell className="text-center text-muted-foreground">{row.goalsAgainst}</TableCell>
                          <TableCell className="text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</TableCell>
                          <TableCell className="text-center font-orbitron font-bold text-primary">{row.points}</TableCell><TableCell><FormIndicator form={row.form} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {standings.length === 0 && <EmptyState title="The table is waiting" detail="Add the confirmed participants to this season to start the competition table." />}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fixtures" className="mt-0">
              <div className="overflow-hidden rounded-lg border border-border bg-card/50">
                <PanelHeader eyebrow="Match centre" title="Upcoming fixtures" />
                {fixtures.map((match) => <MatchRow key={match.id} match={match} playerMap={playerMap} completed={false} />)}
                {fixtures.length === 0 && <EmptyState title="No fixtures scheduled" detail="The next round will appear here as soon as the match list is published." />}
              </div>
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <div className="overflow-hidden rounded-lg border border-border bg-card/50">
                <PanelHeader eyebrow="Match centre" title="Latest results" />
                {results.map((match) => <MatchRow key={match.id} match={match} playerMap={playerMap} completed />)}
                {results.length === 0 && <EmptyState title="No final scores yet" detail="Completed matches will be recorded here and reflected in the table automatically." />}
              </div>
            </TabsContent>

            <TabsContent value="players" className="mt-0">
              {seasonPlayers.length > 0 ? (
                <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {seasonPlayers.map((player) => {
                    const stats = playerStats.find((item) => item.playerId === player.id);
                    return (
                      <article key={player.id} className="bg-card p-5">
                        <div className="flex items-center gap-3"><PlayerAvatar player={player} size="lg" /><div className="min-w-0"><h3 className="truncate font-semibold">{player.username}</h3><p className="mt-0.5 text-xs text-muted-foreground">{stats?.played || 0} matches played</p></div></div>
                        <dl className="mt-5 grid grid-cols-4 border-y border-border py-3 text-center">
                          {([['W', stats?.wins || 0], ['D', stats?.draws || 0], ['L', stats?.losses || 0], ['GF', stats?.goals || 0]] as const).map(([label, value]) => (
                            <div key={label}><dt className="text-[10px] font-semibold text-muted-foreground">{label}</dt><dd className="mt-1 font-orbitron text-sm font-semibold">{value}</dd></div>
                          ))}
                        </dl>
                        <div className="mt-4 flex min-h-[24px] items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Recent form</span>{stats?.form.length ? <FormIndicator form={stats.form} /> : <span className="text-xs text-muted-foreground">—</span>}</div>
                        {player.achievements?.length > 0 && <div className="mt-4"><BadgeList badges={player.achievements} /></div>}
                      </article>
                    );
                  })}
                </div>
              ) : <div className="rounded-lg border border-border bg-card/50"><EmptyState title="No participants registered" detail="Add the confirmed tournament participants in the admin portal and they will appear here." /></div>}
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="grid gap-4 lg:grid-cols-3">
                <RankingList eyebrow="Goals" title="Top scorers" icon={<Target className="h-4 w-4" />} rows={playerStats.slice().sort((a, b) => b.goals - a.goals).map((item) => ({ id: item.playerId, name: item.username, value: item.goals }))} />
                <RankingList eyebrow="Results" title="Most wins" icon={<Award className="h-4 w-4" />} rows={playerStats.slice().sort((a, b) => b.wins - a.wins).map((item) => ({ id: item.playerId, name: item.username, value: item.wins }))} />
                <RankingList eyebrow="Defense" title="Fewest conceded" icon={<Shield className="h-4 w-4" />} rows={standings.filter((row) => row.played > 0).sort((a, b) => a.goalsAgainst - b.goalsAgainst).map((item) => ({ id: item.playerId, name: item.username, value: item.goalsAgainst }))} />
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="overflow-hidden rounded-lg border border-border bg-card/50">
                <PanelHeader eyebrow="Competition archive" title="Previous seasons" />
                {completedSeasons.map((season) => {
                  const archivedMatches = matches.filter((match) => match.season_id === season.id);
                  const archivedPlayers = players.filter((player) => player.season_id === season.id);
                  const archivedResults = archivedMatches.filter((match) => match.status === 'completed');
                  const champion = calculateStandings(archivedMatches, archivedPlayers)[0];
                  return (
                    <article key={season.id} className="flex flex-col gap-4 border-b border-border px-4 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary"><History className="h-4 w-4" /></span><div><h3 className="font-semibold">{season.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{archivedPlayers.length} participants · {archivedResults.length} matches</p></div></div>
                      <div className="flex items-center gap-3 sm:text-right"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Champion</p><p className="mt-1 text-sm font-semibold">{champion?.username || 'Not recorded'}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div>
                    </article>
                  );
                })}
                {completedSeasons.length === 0 && <EmptyState title="The archive is empty" detail="Completed tournaments will remain here as part of the community record." />}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : <div className="rounded-lg border border-border bg-card/50"><EmptyState title="No competition configured" detail="Create a season in the admin portal before adding participants and fixtures." /></div>}
    </section>
  );
}

function PanelHeader({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-border px-4 py-4 sm:px-6">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold">{title}</h2></div>
      {detail && <p className="hidden text-xs text-muted-foreground sm:block">{detail}</p>}
    </div>
  );
}

function RankingList({ eyebrow, title, icon, rows }: { eyebrow: string; title: string; icon: React.ReactNode; rows: { id: string; name: string; value: number }[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card/50">
      <div className="border-b border-border px-5 py-4"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{icon}{eyebrow}</p><h2 className="mt-1 text-base font-semibold">{title}</h2></div>
      <div>
        {rows.slice(0, 5).map((row, index) => <div key={row.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"><span className="font-orbitron text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><span className="truncate text-sm font-medium">{row.name}</span><span className="font-orbitron text-sm font-semibold text-primary">{row.value}</span></div>)}
        {rows.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted-foreground">No results recorded</p>}
      </div>
    </section>
  );
}
