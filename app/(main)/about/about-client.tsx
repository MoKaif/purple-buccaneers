'use client';

import { motion } from 'framer-motion';
import { Skull, Target, Users, Trophy, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';
import { Button } from '@/components/ui/button';

const values = [
  { icon: Users, title: 'Community First', desc: 'We are a small, tight-knit group where everyone knows everyone. No drama, just good games.' },
  { icon: Trophy, title: 'Competitive Spirit', desc: 'Our FIFA leagues are real — with standings, stats, and trophies. But we keep it friendly.' },
  { icon: Target, title: 'Always Evolving', desc: 'From movie nights to Minecraft builds, we are always trying new things and growing together.' },
];

export function AboutClient({ discordUrl }: { discordUrl: string }) {
  return (
    <div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* About section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Skull className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-orbitron text-2xl font-bold">About Purple Buccaneers</h2>
          </div>
          <GlassCard hover={false}>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Purple Buccaneers is a gaming community built around friendship, competition, and good times.
                What started as a small group of friends playing FIFA has grown into a community that hosts
                regular events, runs competitive leagues, and shares memorable moments together.
              </p>
              <p>
                We are a crew of 5–20 members who gather on Discord to play games, watch matches together,
                build in Minecraft, and just hang out. Our FIFA league is the centerpiece of our competitive
                side, but it is far from the only thing we do.
              </p>
              <p>
                This website is our public home — a place where members can check upcoming events, follow
                the league, browse our history, and where newcomers can get a feel for who we are before
                jumping in.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-orbitron text-2xl font-bold">Our Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <value.icon className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <GlassCard hover={false} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-50" />
            <div className="relative">
              <h2 className="font-orbitron text-3xl font-bold mb-4">Join the Crew</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Ready to set sail with us? Join our Discord server and introduce yourself.
                We are always happy to welcome new members.
              </p>
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12 text-base">
                  Join Discord
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
}
