'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { EventItem } from '@/lib/types';

interface EventForm {
  title: string;
  description: string;
  banner_url: string;
  event_date: string;
  status: string;
  is_featured: boolean;
}

const emptyForm: EventForm = {
  title: '', description: '', banner_url: '', event_date: '', status: 'upcoming', is_featured: false,
};

export default function AdminEventsPage() {
  const { data: events, loading, create, update, remove } = useAdminData<EventItem>('/api/admin/events');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setForm({
      title: event.title,
      description: event.description || '',
      banner_url: event.banner_url || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      status: event.status,
      is_featured: event.is_featured,
    });
    setEditingId(event.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || null,
      banner_url: form.banner_url || null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : new Date().toISOString(),
      status: form.status,
      is_featured: form.is_featured,
    };
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload);
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <AdminPageHeader title="Events" description="Create and manage community events." onAdd={openAdd} addLabel="Create Event" />

      {loading && <LoadingState />}

      {!loading && events.length === 0 && <EmptyState message="No events yet. Create your first event." />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, i) => (
          <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl overflow-hidden">
              {event.banner_url && (
                <div className="h-32 overflow-hidden">
                  <img src={event.banner_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.status === 'live' ? 'bg-success/20 text-success' :
                        event.status === 'upcoming' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-muted text-muted-foreground'
                      }`}>{event.status}</span>
                      {event.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(event.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
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
              <Label>Banner URL</Label>
              <Input value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} placeholder="https://..." className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
              <Label>Featured on homepage</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">{editingId ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
