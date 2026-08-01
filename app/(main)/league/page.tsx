import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
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
      <PageHeader
        title="FIFA League"
        subtitle="Standings, fixtures, results, and player profiles — all auto-calculated from match results."
      />
      <LeagueClient
        seasons={seasons}
        players={players}
        matches={matches}
        initialSeasonId={initialSeason?.id ?? null}
      />
    </div>
  );
}
