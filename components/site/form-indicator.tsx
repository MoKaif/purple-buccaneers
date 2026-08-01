'use client';

import { cn } from '@/lib/utils';

interface FormIndicatorProps {
  form: ('W' | 'D' | 'L')[];
  className?: string;
}

export function FormIndicator({ form, className }: FormIndicatorProps) {
  if (!form || form.length === 0) {
    return <span className="text-xs text-muted-foreground">No matches</span>;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {form.map((result, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold',
            result === 'W' && 'bg-success/20 text-success',
            result === 'D' && 'bg-muted text-muted-foreground',
            result === 'L' && 'bg-destructive/20 text-destructive'
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
