'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AdminPageHeader({
  title,
  description,
  onAdd,
  addLabel = 'Add New',
}: {
  title: string;
  description: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="font-orbitron text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Button>
      )}
    </motion.div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-xl p-4 ${className || ''}`}>{children}</div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 rounded-xl bg-card/30 animate-pulse" />
      ))}
    </div>
  );
}
