import type { Metadata } from 'next';
import { getSeasons, getPlayers, getMatches } from '@/lib/queries';
import { LeagueClient } from './league-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'FIFA League — Purple Buccaneers',
  description: 'Live standings, fixtures, results, and player profiles from the Purple Buccaneers FIFA league.',
  openGraph: {
    title: 'FIFA League — Purple Buccaneers',
    description: 'Live standings, fixtures, results, and player profiles from the Purple Buccaneers FIFA league.',
  },
};

export default async function LeaguePage() {
  const [seasons, players, matches] = await Promise.all([
    getSeasons(),
    getPlayers(),
    getMatches(),
  ]);

  const initialSeason = seasons.find((s) => s.status === 'active') || seasons[0] || null;

  return (
    <div>
      <header className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pb-12 lg:pt-36">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Purple Buccaneers competition
            </p>
            <h1 className="max-w-4xl font-orbitron text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              FIFA tournament
              <span className="block text-muted-foreground">match centre.</span>
            </h1>
          </div>
          <p className="max-w-md border-l border-border pl-5 text-sm leading-6 text-muted-foreground lg:mb-1">
            Confirmed participants, scheduled fixtures, final scores and a table calculated directly from the official match record.
          </p>
        </div>
      </header>
      <LeagueClient
        seasons={seasons}
        players={players}
        matches={matches}
        initialSeasonId={initialSeason?.id ?? null}
      />
    </div>
  );
}
