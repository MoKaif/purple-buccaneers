'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, X } from 'lucide-react';
import { Badge } from '@/components/site/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GalleryItem } from '@/lib/types';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'poster', label: 'Posters' },
  { value: 'screenshot', label: 'Screenshots' },
  { value: 'moment', label: 'Moments' },
  { value: 'winner', label: 'Winners' },
];

const categoryVariant: Record<string, 'gold' | 'purple' | 'green' | 'blue' | 'red'> = {
  poster: 'purple',
  screenshot: 'blue',
  moment: 'green',
  winner: 'gold',
};

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const filtered = filter === 'all' ? items : items.filter((item) => item.category === filter);

  // Only offer tabs for categories that actually have images.
  const available = categories.filter(
    (cat) => cat.value === 'all' || items.some((item) => item.category === cat.value)
  );

  return (
    <>
      <div className="flex justify-center mb-8">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {available.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="text-xs md:text-sm">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No images in this category yet.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
              className="break-inside-avoid mb-6"
            >
              <button
                type="button"
                onClick={() => setLightbox(item)}
                aria-label={`View ${item.title}`}
                className="w-full text-left cursor-pointer group relative overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity rounded-2xl flex flex-col justify-end p-4">
                  <h4 className="font-semibold">{item.title}</h4>
                  <Badge
                    text={item.category}
                    variant={categoryVariant[item.category] || 'purple'}
                    className="mt-2 w-fit"
                  />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-xl">
              <h3 className="font-orbitron text-xl font-bold">{lightbox.title}</h3>
              <Badge
                text={lightbox.category}
                variant={categoryVariant[lightbox.category] || 'purple'}
                className="mt-2"
              />
            </div>
            <button
              type="button"
              aria-label="Close"
              autoFocus
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setLightbox(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
