'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { Announcement } from '@/lib/types';

interface AnnouncementForm {
  title: string;
  description: string;
  type: string;
  icon: string;
}

const emptyForm: AnnouncementForm = { title: '', description: '', type: 'update', icon: 'activity' };

const typeLabels: Record<string, string> = {
  match_result: 'Match Result',
  event: 'Event',
  tournament: 'Tournament',
  update: 'Update',
};

export default function AdminAnnouncementsPage() {
  const { data: items, loading, create, update, remove } = useAdminData<Announcement>('/api/admin/announcements');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (item: Announcement) => {
    setForm({ title: item.title, description: item.description || '', type: item.type, icon: item.icon || 'activity' });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: form.title, description: form.description || null, type: form.type, icon: form.icon };
    if (editingId) { await update(editingId, payload); } else { await create(payload); }
    setDialogOpen(false);
  };

  return (
    <div>
      <AdminPageHeader title="Announcements" description="Manage the latest activity timeline on the homepage." onAdd={openAdd} addLabel="Add Announcement" />

      {loading && <LoadingState />}
      {!loading && items.length === 0 && <EmptyState message="No announcements yet." />}

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Bell className="h-4 w-4 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{item.title}</h4>
                {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{typeLabels[item.type] || item.type}</span>
                  <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-card/50" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="match_result">Match Result</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="trophy">Trophy</SelectItem>
                  <SelectItem value="crown">Crown</SelectItem>
                  <SelectItem value="film">Film</SelectItem>
                  <SelectItem value="swords">Swords</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                </SelectContent>
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
