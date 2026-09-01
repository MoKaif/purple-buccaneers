'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { Member } from '@/lib/types';

interface MemberForm {
  username: string;
  role: string;
  bio: string;
  avatar_url: string;
  badges: string;
  is_featured: boolean;
  sort_order: number;
}

const emptyForm: MemberForm = {
  username: '', role: 'Member', bio: '', avatar_url: '', badges: '', is_featured: false, sort_order: 0,
};

export default function AdminMembersPage() {
  const { data: members, loading, create, update, remove } = useAdminData<Member>('/api/admin/members');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (member: Member) => {
    setForm({
      username: member.username,
      role: member.role,
      bio: member.bio || '',
      avatar_url: member.avatar_url || '',
      badges: member.badges?.join(', ') || '',
      is_featured: member.is_featured,
      sort_order: member.sort_order,
    });
    setEditingId(member.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: form.username,
      role: form.role,
      bio: form.bio || null,
      avatar_url: form.avatar_url || null,
      badges: form.badges ? form.badges.split(',').map((b) => b.trim()).filter(Boolean) : [],
      is_featured: form.is_featured,
      sort_order: form.sort_order,
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
      <AdminPageHeader title="Members" description="Manage your community member directory." onAdd={openAdd} addLabel="Add Member" />

      {loading && <LoadingState />}

      {!loading && members.length === 0 && <EmptyState message="No members yet. Add your first member." />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, i) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl p-4">
              <div className="flex items-start gap-3">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" className="w-12 h-12 rounded-full border-2 border-primary/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{member.username[0]}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{member.username}</h4>
                  <p className="text-xs text-primary">{member.role}</p>
                  {member.is_featured && <span className="text-xs text-yellow-400">Featured</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(member.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {member.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>}
              {member.badges && member.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {member.badges.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{b}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Member' : 'Add Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-card/50" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Badges (comma-separated)</Label>
              <Input value={form.badges} onChange={(e) => setForm({ ...form, badges: e.target.value })} placeholder="Founder, Champion S1" className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-card/50" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
              <Label>Featured on homepage</Label>
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
