'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdminPageHeader, LoadingState, EmptyState } from '@/components/admin/shared';
import { useAdminData } from '@/lib/use-admin-data';
import type { GalleryItem } from '@/lib/types';

interface GalleryForm {
  title: string;
  image_url: string;
  category: string;
}

const emptyForm: GalleryForm = { title: '', image_url: '', category: 'community' };

const categories = [
  { value: 'poster', label: 'Tournament Poster' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'moment', label: 'Community Moment' },
  { value: 'winner', label: 'Winner Image' },
];

export default function AdminGalleryPage() {
  const { data: items, loading, create, remove } = useAdminData<GalleryItem>('/api/admin/gallery');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ title: form.title, image_url: form.image_url, category: form.category });
    setForm(emptyForm);
    setDialogOpen(false);
  };

  return (
    <div>
      <AdminPageHeader title="Gallery" description="Upload and manage gallery images." onAdd={() => setDialogOpen(true)} addLabel="Add Image" />

      {loading && <LoadingState />}
      {!loading && items.length === 0 && <EmptyState message="No images yet. Add your first image." />}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
            <div className="glass rounded-xl overflow-hidden group relative">
              <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-destructive hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required placeholder="https://..." className="bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover" />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Add Image</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
