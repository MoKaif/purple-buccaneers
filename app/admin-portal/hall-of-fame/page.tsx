'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { HallOfFame } from '@/lib/types';

interface HOFForm {
  season_name: string;
  champion: string;
  golden_boot: string;
  best_defense: string;
  mvp: string;
  highest_scoring_match: string;
  notes: string;
}

const emptyForm: HOFForm = {
  season_name: '', champion: '', golden_boot: '', best_defense: '', mvp: '', highest_scoring_match: '', notes: '',
};

export default function AdminHallOfFamePage() {
  const { data: items, loading, create, update, remove } = useAdminData<HallOfFame>('/api/admin/hall-of-fame');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HOFForm>(emptyForm);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (item: HallOfFame) => {
    setForm({
      season_name: item.season_name, champion: item.champion || '', golden_boot: item.golden_boot || '',
      best_defense: item.best_defense || '', mvp: item.mvp || '', highest_scoring_match: item.highest_scoring_match || '',
      notes: item.notes || '',
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      season_name: form.season_name,
      champion: form.champion || null, golden_boot: form.golden_boot || null,
      best_defense: form.best_defense || null, mvp: form.mvp || null,
      highest_scoring_match: form.highest_scoring_match || null, notes: form.notes || null,
    };
    if (editingId) { await update(editingId, payload); } else { await create(payload); }
    setDialogOpen(false);
  };

  return (
    <div>
      <AdminPageHeader title="Hall of Fame" description="Archive previous season awards and records." onAdd={openAdd} addLabel="Add Entry" />

      {loading && <LoadingState />}
      {!loading && items.length === 0 && <EmptyState message="No hall of fame entries yet." />}

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-400/10"><Trophy className="h-5 w-5 text-yellow-400" /></div>
                  <div>
                    <h4 className="font-orbitron font-bold">{item.season_name}</h4>
                    {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-sm">
                <div><span className="text-xs text-muted-foreground block">Champion</span><span className="font-medium">{item.champion || '—'}</span></div>
                <div><span className="text-xs text-muted-foreground block">Golden Boot</span><span className="font-medium">{item.golden_boot || '—'}</span></div>
                <div><span className="text-xs text-muted-foreground block">Best Defense</span><span className="font-medium">{item.best_defense || '—'}</span></div>
                <div><span className="text-xs text-muted-foreground block">MVP</span><span className="font-medium">{item.mvp || '—'}</span></div>
                <div><span className="text-xs text-muted-foreground block">Top Match</span><span className="font-medium">{item.highest_scoring_match || '—'}</span></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Entry' : 'Add Hall of Fame Entry'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Season Name</Label>
              <Input value={form.season_name} onChange={(e) => setForm({ ...form, season_name: e.target.value })} required className="bg-card/50" />
            </div>
            <div className="space-y-2"><Label>Champion</Label><Input value={form.champion} onChange={(e) => setForm({ ...form, champion: e.target.value })} className="bg-card/50" /></div>
            <div className="space-y-2"><Label>Golden Boot</Label><Input value={form.golden_boot} onChange={(e) => setForm({ ...form, golden_boot: e.target.value })} className="bg-card/50" /></div>
            <div className="space-y-2"><Label>Best Defense</Label><Input value={form.best_defense} onChange={(e) => setForm({ ...form, best_defense: e.target.value })} className="bg-card/50" /></div>
            <div className="space-y-2"><Label>MVP</Label><Input value={form.mvp} onChange={(e) => setForm({ ...form, mvp: e.target.value })} className="bg-card/50" /></div>
            <div className="space-y-2"><Label>Highest Scoring Match</Label><Input value={form.highest_scoring_match} onChange={(e) => setForm({ ...form, highest_scoring_match: e.target.value })} placeholder="Player 5-2 Player" className="bg-card/50" /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-card/50" rows={2} /></div>
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
