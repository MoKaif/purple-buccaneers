'use client';

import { motion } from 'framer-motion';
import { Crown, Target, Shield, Star, Zap, Trophy } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';
import type { HallOfFame } from '@/lib/types';

const awards = [
  { key: 'champion', label: 'Champion', icon: Crown, color: 'text-yellow-400' },
  { key: 'golden_boot', label: 'Golden Boot', icon: Target, color: 'text-success' },
  { key: 'best_defense', label: 'Best Defense', icon: Shield, color: 'text-blue-400' },
  { key: 'mvp', label: 'Most Valuable Player', icon: Star, color: 'text-primary' },
  { key: 'highest_scoring_match', label: 'Highest Scoring Match', icon: Zap, color: 'text-destructive' },
];

export function HallOfFameClient({ items }: { items: HallOfFame[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hall of fame entries yet.</p>
      </div>
    );
  }

  return (
    <>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05 }}
        >
          <GlassCard hover={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-yellow-400/10">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-orbitron text-2xl font-bold">{item.season_name}</h3>
                {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {awards.map((award) => {
                const value = (item as unknown as Record<string, string | null>)[award.key];
                return (
                  <div key={award.key} className="p-4 rounded-xl bg-white/5 border border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <award.icon className={`h-4 w-4 ${award.color}`} />
                      <span className="text-xs text-muted-foreground">{award.label}</span>
                    </div>
                    <div className="font-semibold text-sm">{value || '—'}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </>
  );
}
