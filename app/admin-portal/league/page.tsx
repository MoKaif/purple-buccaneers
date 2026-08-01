'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, Trophy, Users, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { LeagueSeason, LeaguePlayer, LeagueMatch } from '@/lib/types';

export default function AdminLeaguePage() {
  return (
    <div>
      <AdminPageHeader title="League Management" description="Manage seasons, players, and match results. Standings auto-calculate from results." />
      <Tabs defaultValue="seasons">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="seasons"><Trophy className="h-4 w-4 mr-1" /> Seasons</TabsTrigger>
          <TabsTrigger value="players"><Users className="h-4 w-4 mr-1" /> Players</TabsTrigger>
          <TabsTrigger value="matches"><Swords className="h-4 w-4 mr-1" /> Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="seasons"><SeasonsTab /></TabsContent>
        <TabsContent value="players"><PlayersTab /></TabsContent>
        <TabsContent value="matches"><MatchesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function SeasonsTab() {
  const { data: seasons, loading, create, update, remove } = useAdminData<LeagueSeason>('/api/admin/seasons');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', status: 'active', current_week: 1 });

  const openAdd = () => { setForm({ name: '', status: 'active', current_week: 1 }); setEditingId(null); setDialogOpen(true); };
  const openEdit = (s: LeagueSeason) => { setForm({ name: s.name, status: s.status, current_week: s.current_week }); setEditingId(s.id); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, status: form.status, current_week: form.current_week };
    if (editingId) { await update(editingId, payload); } else { await create(payload); }
    setDialogOpen(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white"><Plus className="h-4 w-4 mr-2" />Add Season</Button>
      </div>
      {seasons.length === 0 && <EmptyState message="No seasons yet." />}
      <div className="space-y-3">
        {seasons.map((season, i) => (
          <motion.div key={season.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Trophy className="h-5 w-5 text-primary" /></div>
                <div>
                  <h4 className="font-semibold">{season.name}</h4>
                  <p className="text-xs text-muted-foreground">Week {season.current_week} · {season.status}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(season)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(season.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Season' : 'Add Season'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Season Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-card/50" /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Current Week</Label><Input type="number" value={form.current_week} onChange={(e) => setForm({ ...form, current_week: parseInt(e.target.value) || 1 })} className="bg-card/50" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">{editingId ? 'Save' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlayersTab() {
  const { data: players, loading, create, update, remove } = useAdminData<LeaguePlayer>('/api/admin/players');
  const { data: seasons } = useAdminData<LeagueSeason>('/api/admin/seasons');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ username: '', avatar_url: '', season_id: '', achievements: '' });

  const openAdd = () => { setForm({ username: '', avatar_url: '', season_id: seasons.find((s) => s.status === 'active')?.id || '', achievements: '' }); setEditingId(null); setDialogOpen(true); };
  const openEdit = (p: LeaguePlayer) => { setForm({ username: p.username, avatar_url: p.avatar_url || '', season_id: p.season_id || '', achievements: p.achievements?.join(', ') || '' }); setEditingId(p.id); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: form.username,
      avatar_url: form.avatar_url || null,
      season_id: form.season_id || null,
      achievements: form.achievements ? form.achievements.split(',').map((a) => a.trim()).filter(Boolean) : [],
    };
    if (editingId) { await update(editingId, payload); } else { await create(payload); }
    setDialogOpen(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white"><Plus className="h-4 w-4 mr-2" />Add Player</Button>
      </div>
      {players.length === 0 && <EmptyState message="No players yet." />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player, i) => {
          const season = seasons.find((s) => s.id === player.season_id);
          return (
            <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="glass rounded-xl p-4 flex items-start gap-3">
                {player.avatar_url ? (
                  <img src={player.avatar_url} alt="" className="w-10 h-10 rounded-full border border-primary/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{player.username[0]}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{player.username}</h4>
                  <p className="text-xs text-muted-foreground">{season?.name || 'No season'}</p>
                  {player.achievements && player.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {player.achievements.slice(0, 2).map((a, i) => <span key={i} className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{a}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(player.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Player' : 'Add Player'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Username</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="bg-card/50" /></div>
            <div className="space-y-2"><Label>Avatar URL</Label><Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="bg-card/50" /></div>
            <div className="space-y-2">
              <Label>Season</Label>
              <Select value={form.season_id} onValueChange={(v) => setForm({ ...form, season_id: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue placeholder="Select season" /></SelectTrigger>
                <SelectContent>{seasons.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Achievements (comma-separated)</Label><Input value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} className="bg-card/50" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">{editingId ? 'Save' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatchesTab() {
  const { data: matches, loading, create, update, remove } = useAdminData<LeagueMatch>('/api/admin/matches');
  const { data: seasons } = useAdminData<LeagueSeason>('/api/admin/seasons');
  const { data: players } = useAdminData<LeaguePlayer>('/api/admin/players');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ season_id: '', week: 1, home_player_id: '', away_player_id: '', home_score: 0, away_score: 0, status: 'scheduled' });

  const openAdd = () => {
    setForm({ season_id: seasons.find((s) => s.status === 'active')?.id || '', week: 1, home_player_id: '', away_player_id: '', home_score: 0, away_score: 0, status: 'scheduled' });
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (m: LeagueMatch) => {
    setForm({ season_id: m.season_id || '', week: m.week, home_player_id: m.home_player_id || '', away_player_id: m.away_player_id || '', home_score: m.home_score, away_score: m.away_score, status: m.status });
    setEditingId(m.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      season_id: form.season_id || null,
      week: form.week,
      home_player_id: form.home_player_id || null,
      away_player_id: form.away_player_id || null,
      home_score: form.home_score,
      away_score: form.away_score,
      status: form.status,
    };
    if (editingId) { await update(editingId, payload); } else { await create(payload); }
    setDialogOpen(false);
  };

  const getPlayerName = (id: string | null) => players.find((p) => p.id === id)?.username || 'TBD';

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white"><Plus className="h-4 w-4 mr-2" />Add Match</Button>
      </div>
      {matches.length === 0 && <EmptyState message="No matches yet." />}
      <div className="space-y-3">
        {matches.map((match, i) => (
          <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Week {match.week}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${match.status === 'completed' && match.home_score > match.away_score ? 'text-success' : ''}`}>{getPlayerName(match.home_player_id)}</span>
                  {match.status === 'completed' ? (
                    <span className="font-orbitron font-bold px-2">{match.home_score} - {match.away_score}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm px-2">vs</span>
                  )}
                  <span className={`font-medium ${match.status === 'completed' && match.away_score > match.home_score ? 'text-success' : ''}`}>{getPlayerName(match.away_player_id)}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${match.status === 'completed' ? 'bg-success/20 text-success' : 'bg-blue-400/20 text-blue-400'}`}>{match.status}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(match)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(match.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Match' : 'Add Match'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Season</Label>
              <Select value={form.season_id} onValueChange={(v) => setForm({ ...form, season_id: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue placeholder="Select season" /></SelectTrigger>
                <SelectContent>{seasons.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Week</Label><Input type="number" value={form.week} onChange={(e) => setForm({ ...form, week: parseInt(e.target.value) || 1 })} className="bg-card/50" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Home Player</Label>
                <Select value={form.home_player_id} onValueChange={(v) => setForm({ ...form, home_player_id: v })}>
                  <SelectTrigger className="bg-card/50"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{players.filter((p) => p.season_id === form.season_id).map((p) => <SelectItem key={p.id} value={p.id}>{p.username}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Away Player</Label>
                <Select value={form.away_player_id} onValueChange={(v) => setForm({ ...form, away_player_id: v })}>
                  <SelectTrigger className="bg-card/50"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{players.filter((p) => p.season_id === form.season_id).map((p) => <SelectItem key={p.id} value={p.id}>{p.username}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Home Score</Label><Input type="number" value={form.home_score} onChange={(e) => setForm({ ...form, home_score: parseInt(e.target.value) || 0 })} className="bg-card/50" /></div>
              <div className="space-y-2"><Label>Away Score</Label><Input type="number" value={form.away_score} onChange={(e) => setForm({ ...form, away_score: parseInt(e.target.value) || 0 })} className="bg-card/50" /></div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">{editingId ? 'Save' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
