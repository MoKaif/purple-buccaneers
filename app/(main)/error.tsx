'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="inline-flex p-4 rounded-2xl bg-destructive/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="font-orbitron text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-8">
        We could not load this page. This is usually temporary — try again in a moment.
      </p>
      <Button onClick={reset} size="lg" className="bg-primary hover:bg-primary/90">
        <RotateCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground">Reference: {error.digest}</p>
      )}
    </div>
  );
}
