'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { GlassCard } from '@/components/site/glass-card';
import { Badge } from '@/components/site/badge';
import type { EventItem } from '@/lib/types';

function Countdown({ date }: { date: string }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const items = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Mins', value: remaining.mins },
    { label: 'Secs', value: remaining.secs },
  ];

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <div key={item.label} className="text-center px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 min-w-[60px]">
          <div className="font-orbitron text-xl font-bold text-primary tabular-nums">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

const statusVariant: Record<string, 'gold' | 'purple' | 'green' | 'blue' | 'red'> = {
  upcoming: 'blue',
  live: 'green',
  ended: 'purple',
};

/**
 * Dates are formatted client-side after mount. Rendering them during SSR would
 * use the server's timezone and then mismatch on hydration.
 */
function EventDate({ iso }: { iso: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const d = new Date(iso);
    setText(
      `${d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    );
  }, [iso]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 min-h-[20px]">
      <Calendar className="h-4 w-4 text-primary shrink-0" />
      <Clock className="h-4 w-4 text-primary shrink-0" />
      <span>{text ?? '—'}</span>
    </div>
  );
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05 }}
    >
      <GlassCard hover={false} className="p-0 overflow-hidden h-full">
        {event.banner_url && (
          <div className="relative h-48 overflow-hidden">
            <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge text={event.status} variant={statusVariant[event.status] || 'purple'} />
            </div>
          </div>
        )}
        <div className="p-6">
          <h3 className="font-orbitron text-xl font-bold mb-2">{event.title}</h3>
          {event.description && <p className="text-sm text-muted-foreground mb-4">{event.description}</p>}
          <EventDate iso={event.event_date} />
          {event.status === 'upcoming' && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Countdown</p>
              <Countdown date={event.event_date} />
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function EventsClient({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No events scheduled yet. Check back soon!</p>
      </div>
    );
  }

  const upcoming = events.filter((e) => e.status !== 'ended');
  const past = events.filter((e) => e.status === 'ended');

  return (
    <div className="space-y-14">
      {upcoming.length > 0 && (
        <div>
          <h2 className="font-orbitron text-sm uppercase tracking-widest text-primary mb-6">
            Upcoming &amp; Live
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-6">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {past.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
