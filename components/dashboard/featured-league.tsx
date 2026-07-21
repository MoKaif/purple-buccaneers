import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/glass-card";
import { GlowButton } from "../ui/glow-button";
import { Trophy } from "lucide-react";

export function FeaturedLeague() {
  return (
    <GlassCard variant="glow" className="overflow-hidden" animated={false}>
      <div className="relative p-8 md:p-12">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-between mb-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-accent" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Featured League
                </h2>
              </div>
              <p className="text-foreground/60">
                2024-25 Fantasy Premier League Championship
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-8"
          >
            {/* League stats */}
            <div>
              <p className="text-foreground/60 text-sm uppercase tracking-wide mb-2">
                Total Participants
              </p>
              <p className="text-4xl font-bold text-primary">1,247</p>
            </div>

            <div>
              <p className="text-foreground/60 text-sm uppercase tracking-wide mb-2">
                Gameweek
              </p>
              <p className="text-4xl font-bold text-accent">22 / 38</p>
            </div>

            <div>
              <p className="text-foreground/60 text-sm uppercase tracking-wide mb-2">
                Prize Pool
              </p>
              <p className="text-4xl font-bold text-secondary">$25,000</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <GlowButton variant="primary" size="md">
              View Standings
            </GlowButton>
            <GlowButton variant="outline" size="md">
              Manage League
            </GlowButton>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
