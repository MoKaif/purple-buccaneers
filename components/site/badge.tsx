'use client';

import { cn } from '@/lib/utils';
import { Crown, Trophy, Shield, Star, Medal, Award, Zap, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  crown: Crown,
  shield: Shield,
  star: Star,
  medal: Medal,
  award: Award,
  zap: Zap,
  target: Target,
};

const colorMap: Record<string, string> = {
  gold: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  purple: 'text-primary bg-primary/10 border-primary/20',
  green: 'text-success bg-success/10 border-success/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  red: 'text-destructive bg-destructive/10 border-destructive/20',
};

interface BadgeProps {
  text: string;
  variant?: 'gold' | 'purple' | 'green' | 'blue' | 'red';
  icon?: string;
  className?: string;
}

export function Badge({ text, variant = 'purple', icon, className }: BadgeProps) {
  const Icon = icon ? iconMap[icon] : null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        colorMap[variant],
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {text}
    </span>
  );
}

export function BadgeList({ badges, className }: { badges: string[]; className?: string }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge, i) => (
        <Badge key={i} text={badge} variant={i === 0 ? 'gold' : 'purple'} />
      ))}
    </div>
  );
}
