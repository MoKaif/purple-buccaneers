'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, BarChart3, Users, History, Crown, Target, Shield, TrendingUp, Award } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';
import { FormIndicator } from '@/components/site/form-indicator';
import { Badge, BadgeList } from '@/components/site/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateStandings, calculatePlayerStats } from '@/lib/standings';
import type { LeagueSeason, LeaguePlayer, LeagueMatch, StandingRow, PlayerStats } from '@/lib/types';

interface LeagueClientProps {
  seasons: LeagueSeason[];
  players: LeaguePlayer[];
  matches: LeagueMatch[];
  initialSeasonId: string | null;
}

export function LeagueClient({ seasons, players, matches, initialSeasonId }: LeagueClientProps) {
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(initialSeasonId);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const activeSeason = seasons.find((s) => s.id === activeSeasonId) || null;
  const setActiveSeason = (season: LeagueSeason | null) => setActiveSeasonId(season?.id ?? null);

  const seasonMatches = activeSeason ? matches.filter((m) => m.season_id === activeSeason.id) : [];
  const seasonPlayers = activeSeason ? players.filter((p) => p.season_id === activeSeason.id) : [];
  const standings = calculateStandings(seasonMatches, seasonPlayers);
  const fixtures = seasonMatches.filter((m) => m.status === 'scheduled');
  const results = seasonMatches.filter((m) => m.status === 'completed').reverse();
  const completedSeasons = seasons.filter((s) => s.status === 'completed');

  const playerStats: PlayerStats[] = seasonPlayers.map((p) => calculatePlayerStats(p.id, seasonMatches, seasonPlayers)!).filter(Boolean);
  const topScorer = [...playerStats].sort((a, b) => b.goals - a.goals)[0];
  const bestDefense = [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];

  const getPlayerName = (id: string | null) => seasonPlayers.find((p) => p.id === id)?.username || 'TBD';
  const getPlayerAvatar = (id: string | null) => seasonPlayers.find((p) => p.id === id)?.avatar_url;

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Season selector + spotlight cards */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <select
              value={activeSeason?.id || ''}
              onChange={(e) => setActiveSeason(seasons.find((s) => s.id === e.target.value) || null)}
              className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>{s.name} {s.status === 'active' && '(Active)'}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Week {activeSeason?.current_week || 1}
          </div>
        </div>

        {/* Spotlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-muted-foreground">League Leader</span>
            </div>
            <div className="font-orbitron text-xl font-bold">{standings[0]?.username || '—'}</div>
            <div className="text-sm text-primary mt-1">{standings[0]?.points || 0} pts</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Top Scorer</span>
            </div>
            <div className="font-orbitron text-xl font-bold">{topScorer?.username || '—'}</div>
            <div className="text-sm text-success mt-1">{topScorer?.goals || 0} goals</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-muted-foreground">Best Defense</span>
            </div>
            <div className="font-orbitron text-xl font-bold">{bestDefense?.username || '—'}</div>
            <div className="text-sm text-blue-400 mt-1">{bestDefense?.goalsAgainst ?? 0} conceded</div>
          </GlassCard>
        </div>

        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 h-auto">
            <TabsTrigger value="standings" className="text-xs md:text-sm">Standings</TabsTrigger>
            <TabsTrigger value="fixtures" className="text-xs md:text-sm">Fixtures</TabsTrigger>
            <TabsTrigger value="results" className="text-xs md:text-sm">Results</TabsTrigger>
            <TabsTrigger value="players" className="text-xs md:text-sm">Players</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs md:text-sm">Statistics</TabsTrigger>
            <TabsTrigger value="history" className="text-xs md:text-sm">History</TabsTrigger>
          </TabsList>

          {/* Standings */}
          <TabsContent value="standings">
            <GlassCard hover={false} className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">P</TableHead>
                    <TableHead className="text-center">W</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">GF</TableHead>
                    <TableHead className="text-center">GA</TableHead>
                    <TableHead className="text-center">GD</TableHead>
                    <TableHead className="text-center font-bold text-primary">Pts</TableHead>
                    <TableHead className="text-center">Form</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((row, i) => (
                    <TableRow key={row.playerId} className="border-border/30">
                      <TableCell className="font-bold">
                        <span className={i === 0 ? 'text-yellow-400' : i < 3 ? 'text-primary' : ''}>{i + 1}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.avatarUrl ? (
                            <img src={row.avatarUrl} alt="" className="w-7 h-7 rounded-full" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{row.username[0]}</div>
                          )}
                          <span className="font-medium">{row.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{row.played}</TableCell>
                      <TableCell className="text-center text-success">{row.wins}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.draws}</TableCell>
                      <TableCell className="text-center text-destructive">{row.losses}</TableCell>
                      <TableCell className="text-center">{row.goalsFor}</TableCell>
                      <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                      <TableCell className="text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{row.points}</TableCell>
                      <TableCell><FormIndicator form={row.form} /></TableCell>
                    </TableRow>
                  ))}
                  {standings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground py-8">No matches played yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </GlassCard>
          </TabsContent>

          {/* Fixtures */}
          <TabsContent value="fixtures">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fixtures.map((match, i) => (
                <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <GlassCard hover={false}>
                    <div className="flex items-center justify-between mb-3">
                      <Badge text={`Week ${match.week}`} variant="purple" />
                      {match.match_date && <span className="text-xs text-muted-foreground">{new Date(match.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlayerAvatar(match.home_player_id) ? (
                          <img src={getPlayerAvatar(match.home_player_id)!} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20" />
                        )}
                        <span className="font-medium text-sm">{getPlayerName(match.home_player_id)}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">vs</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{getPlayerName(match.away_player_id)}</span>
                        {getPlayerAvatar(match.away_player_id) ? (
                          <img src={getPlayerAvatar(match.away_player_id)!} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20" />
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
              {fixtures.length === 0 && (
                <GlassCard hover={false} className="col-span-2 text-center text-muted-foreground">No upcoming fixtures</GlassCard>
              )}
            </div>
          </TabsContent>

          {/* Results */}
          <TabsContent value="results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((match, i) => (
                <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <GlassCard hover={false}>
                    <div className="flex items-center justify-between mb-3">
                      <Badge text={`Week ${match.week}`} variant="green" />
                      <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {getPlayerAvatar(match.home_player_id) ? (
                          <img src={getPlayerAvatar(match.home_player_id)!} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20" />
                        )}
                        <span className={`font-medium text-sm ${match.home_score > match.away_score ? 'text-success' : ''}`}>{getPlayerName(match.home_player_id)}</span>
                      </div>
                      <div className="font-orbitron text-lg font-bold px-4">
                        {match.home_score} <span className="text-muted-foreground mx-1">-</span> {match.away_score}
                      </div>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className={`font-medium text-sm ${match.away_score > match.home_score ? 'text-success' : ''}`}>{getPlayerName(match.away_player_id)}</span>
                        {getPlayerAvatar(match.away_player_id) ? (
                          <img src={getPlayerAvatar(match.away_player_id)!} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20" />
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
              {results.length === 0 && (
                <GlassCard hover={false} className="col-span-2 text-center text-muted-foreground">No results yet</GlassCard>
              )}
            </div>
          </TabsContent>

          {/* Players */}
          <TabsContent value="players">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonPlayers.map((player, i) => {
                const stats = calculatePlayerStats(player.id, seasonMatches, seasonPlayers);
                return (
                  <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <GlassCard>
                      <div className="flex items-center gap-3 mb-4">
                        {player.avatar_url ? (
                          <img src={player.avatar_url} alt={player.username} className="w-14 h-14 rounded-full border-2 border-primary/30" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">{player.username[0]}</div>
                        )}
                        <div>
                          <h4 className="font-semibold">{player.username}</h4>
                          <p className="text-xs text-muted-foreground">{stats?.played || 0} matches played</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center mb-4">
                        <div><div className="font-bold text-success">{stats?.wins || 0}</div><div className="text-xs text-muted-foreground">W</div></div>
                        <div><div className="font-bold text-muted-foreground">{stats?.draws || 0}</div><div className="text-xs text-muted-foreground">D</div></div>
                        <div><div className="font-bold text-destructive">{stats?.losses || 0}</div><div className="text-xs text-muted-foreground">L</div></div>
                        <div><div className="font-bold text-primary">{stats?.goals || 0}</div><div className="text-xs text-muted-foreground">G</div></div>
                      </div>
                      {stats && stats.form.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Current Form</p>
                          <FormIndicator form={stats.form} />
                        </div>
                      )}
                      {player.achievements && player.achievements.length > 0 && (
                        <BadgeList badges={player.achievements} />
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
              {seasonPlayers.length === 0 && (
                <GlassCard hover={false} className="col-span-3 text-center text-muted-foreground">No players registered for this season</GlassCard>
              )}
            </div>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard hover={false}>
                <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Top Scorers</h3>
                <div className="space-y-3">
                  {[...playerStats].sort((a, b) => b.goals - a.goals).slice(0, 5).map((p, i) => (
                    <div key={p.playerId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="flex items-center gap-2">
                        <span className={`font-bold ${i === 0 ? 'text-yellow-400' : 'text-muted-foreground'}`}>{i + 1}</span>
                        {p.username}
                      </span>
                      <span className="font-bold text-primary">{p.goals}</span>
                    </div>
                  ))}
                  {playerStats.length === 0 && <p className="text-sm text-muted-foreground text-center">No data</p>}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Most Wins</h3>
                <div className="space-y-3">
                  {[...playerStats].sort((a, b) => b.wins - a.wins).slice(0, 5).map((p, i) => (
                    <div key={p.playerId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="flex items-center gap-2">
                        <span className={`font-bold ${i === 0 ? 'text-yellow-400' : 'text-muted-foreground'}`}>{i + 1}</span>
                        {p.username}
                      </span>
                      <span className="font-bold text-success">{p.wins}</span>
                    </div>
                  ))}
                  {playerStats.length === 0 && <p className="text-sm text-muted-foreground text-center">No data</p>}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Best Defenses</h3>
                <div className="space-y-3">
                  {[...standings].filter(s => s.played > 0).sort((a, b) => a.goalsAgainst - b.goalsAgainst).slice(0, 5).map((s, i) => (
                    <div key={s.playerId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="flex items-center gap-2">
                        <span className={`font-bold ${i === 0 ? 'text-yellow-400' : 'text-muted-foreground'}`}>{i + 1}</span>
                        {s.username}
                      </span>
                      <span className="font-bold text-blue-400">{s.goalsAgainst}</span>
                    </div>
                  ))}
                  {standings.length === 0 && <p className="text-sm text-muted-foreground text-center">No data</p>}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Total Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="font-orbitron text-2xl font-bold text-primary">{seasonMatches.filter(m => m.status === 'completed').length}</div>
                    <div className="text-xs text-muted-foreground">Matches Played</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="font-orbitron text-2xl font-bold text-primary">{results.reduce((sum, m) => sum + m.home_score + m.away_score, 0)}</div>
                    <div className="text-xs text-muted-foreground">Total Goals</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="font-orbitron text-2xl font-bold text-primary">{seasonPlayers.length}</div>
                    <div className="text-xs text-muted-foreground">Players</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="font-orbitron text-2xl font-bold text-primary">{activeSeason?.current_week || 0}</div>
                    <div className="text-xs text-muted-foreground">Current Week</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Season History */}
          <TabsContent value="history">
            <div className="space-y-4">
              {completedSeasons.map((s, i) => {
                const sMatches = matches.filter((m) => m.season_id === s.id);
                const sPlayers = players.filter((p) => p.season_id === s.id);
                const sStandings = calculateStandings(sMatches, sPlayers);
                const champion = sStandings[0];
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <GlassCard hover={false}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-orbitron text-xl font-bold flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-400" /> {s.name}
                        </h3>
                        <Badge text="Completed" variant="purple" />
                      </div>
                      {champion && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
                          <Crown className="h-6 w-6 text-yellow-400" />
                          <div>
                            <div className="text-xs text-muted-foreground">Champion</div>
                            <div className="font-bold">{champion.username}</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-xs text-muted-foreground">Points</div>
                            <div className="font-bold text-primary">{champion.points}</div>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Matches: </span><span className="font-medium">{sMatches.filter(m => m.status === 'completed').length}</span></div>
                        <div><span className="text-muted-foreground">Players: </span><span className="font-medium">{sPlayers.length}</span></div>
                        <div><span className="text-muted-foreground">Goals: </span><span className="font-medium">{sMatches.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.home_score + m.away_score, 0)}</span></div>
                        <div><span className="text-muted-foreground">Weeks: </span><span className="font-medium">{s.current_week}</span></div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
              {completedSeasons.length === 0 && (
                <GlassCard hover={false} className="text-center text-muted-foreground">No completed seasons yet</GlassCard>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
