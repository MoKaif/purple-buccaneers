'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminPageHeader } from '@/components/admin/shared';
import type { Settings } from '@/lib/types';

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/data/settings').then((r) => r.json()).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_name: settings.site_name,
        tagline: settings.tagline,
        welcome_message: settings.welcome_message,
        discord_invite_url: settings.discord_invite_url,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="h-64 rounded-xl bg-card/30 animate-pulse" />;

  return (
    <div>
      <AdminPageHeader title="Homepage Content" description="Edit the welcome message and site identity shown on the homepage." />

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="glass rounded-xl p-6 max-w-2xl space-y-4">
        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input value={settings?.site_name || ''} onChange={(e) => setSettings({ ...settings!, site_name: e.target.value })} className="bg-card/50" />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input value={settings?.tagline || ''} onChange={(e) => setSettings({ ...settings!, tagline: e.target.value })} className="bg-card/50" />
        </div>
        <div className="space-y-2">
          <Label>Welcome Message</Label>
          <Textarea value={settings?.welcome_message || ''} onChange={(e) => setSettings({ ...settings!, welcome_message: e.target.value })} className="bg-card/50" rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Discord Invite URL</Label>
          <Input value={settings?.discord_invite_url || ''} onChange={(e) => setSettings({ ...settings!, discord_invite_url: e.target.value })} className="bg-card/50" />
        </div>
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
          {saving ? 'Saving...' : saved ? <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
      </motion.form>
    </div>
  );
}
