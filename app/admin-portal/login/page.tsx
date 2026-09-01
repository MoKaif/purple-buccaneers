'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skull, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.push('/admin-portal');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="grid min-h-screen bg-[#0d0b12] lg:grid-cols-[1fr_520px]">
      <section className="hidden border-r border-border p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white"><Skull className="h-5 w-5" /></span><div><p className="text-sm font-semibold">Purple Buccaneers</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operations</p></div></div>
        <div className="max-w-xl">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Community control room</p>
          <h1 className="font-orbitron text-5xl font-semibold leading-[1.02] tracking-[-0.04em]">Run the tournament.<br /><span className="text-muted-foreground">Keep the record.</span></h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">Manage confirmed participants, fixtures, results and everything published to the Purple Buccaneers community.</p>
        </div>
        <p className="text-xs text-muted-foreground">Private administrative workspace</p>
      </section>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white"><Skull className="h-5 w-5" /></span></div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Restricted access</p>
          <h2 className="text-2xl font-semibold tracking-tight">Sign in to operations</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use your administrator credentials to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mt-8 space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-card pl-10"
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-card pl-10"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="h-11 w-full bg-primary font-semibold text-white hover:bg-primary/90">
            Sign in
          </Button>
        </form>
        </div>
      </main>
    </div>
  );
}
