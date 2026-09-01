'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';
import { BadgeList } from '@/components/site/badge';
import type { Member } from '@/lib/types';

export function MembersClient({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <div className="text-center py-20">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No members yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05 }}
        >
          <GlassCard className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.username} className="relative w-20 h-20 rounded-full border-2 border-primary/30 mx-auto" />
              ) : (
                <div className="relative w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center font-orbitron text-2xl font-bold text-primary mx-auto">
                  {member.username[0]}
                </div>
              )}
            </div>
            <h3 className="font-orbitron text-lg font-bold">{member.username}</h3>
            <p className="text-sm text-primary mb-3">{member.role}</p>
            {member.bio && <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>}
            {member.badges && member.badges.length > 0 && (
              <BadgeList badges={member.badges} className="justify-center" />
            )}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
