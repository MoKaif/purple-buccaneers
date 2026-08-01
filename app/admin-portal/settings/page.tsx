'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminPageHeader } from '@/components/admin/shared';
import type { Settings } from '@/lib/types';

export default function AdminSettingsPage() {
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
        stat_members: settings.stat_members,
        stat_online: settings.stat_online,
        stat_seasons: settings.stat_seasons,
        stat_matches: settings.stat_matches,
        stat_goals: settings.stat_goals,
        stat_events: settings.stat_events,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="h-64 rounded-xl bg-card/30 animate-pulse" />;

  const stats = [
    { key: 'stat_members', label: 'Members' },
    { key: 'stat_online', label: 'Online Members' },
    { key: 'stat_seasons', label: 'Seasons Played' },
    { key: 'stat_matches', label: 'Matches Played' },
    { key: 'stat_goals', label: 'Goals Scored' },
    { key: 'stat_events', label: 'Events Hosted' },
  ] as const;

  return (
    <div>
      <AdminPageHeader title="Settings" description="Update community stats displayed on the homepage." />

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="glass rounded-xl p-6 max-w-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.key} className="space-y-2">
              <Label>{stat.label}</Label>
              <Input
                type="number"
                value={settings?.[stat.key] ?? 0}
                onChange={(e) => setSettings({ ...settings!, [stat.key]: parseInt(e.target.value) || 0 })}
                className="bg-card/50"
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
          {saving ? 'Saving...' : saved ? <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</> : <><Save className="h-4 w-4 mr-2" />Save Stats</>}
        </Button>
      </motion.form>
    </div>
  );
}
