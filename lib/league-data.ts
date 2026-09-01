export type League = { id: string; name: string; season: string };
export type Team = { id: string; league_id: string; name: string; short_name: string };
export type Fixture = {
  id: string; league_id: string; home_team_id: string; away_team_id: string;
  kickoff_at: string; status: "scheduled" | "live" | "completed" | "postponed";
  home_score: number | null; away_score: number | null; venue: string | null;
};

export async function fetchLeagueData() {
  const response = await fetch("/api/league-data", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load league data");
  return (await response.json()) as { leagues: League[]; teams: Team[]; fixtures: Fixture[] };
}

export function calculateStandings(teams: Team[], fixtures: Fixture[], leagueId?: string) {
  const rows = new Map(teams.filter((team) => !leagueId || team.league_id === leagueId).map((team) => [team.id, { team, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }]));
  fixtures.filter((fixture) => fixture.status === "completed" && fixture.home_score !== null && fixture.away_score !== null && (!leagueId || fixture.league_id === leagueId)).forEach((fixture) => {
    const home = rows.get(fixture.home_team_id); const away = rows.get(fixture.away_team_id);
    if (!home || !away) return;
    const hs = fixture.home_score!; const as = fixture.away_score!;
    home.played++; away.played++; home.goalsFor += hs; home.goalsAgainst += as; away.goalsFor += as; away.goalsAgainst += hs;
    if (hs > as) { home.wins++; home.points += 3; away.losses++; } else if (hs < as) { away.wins++; away.points += 3; home.losses++; } else { home.draws++; away.draws++; home.points++; away.points++; }
  });
  return [...rows.values()].sort((a,b) => b.points-a.points || (b.goalsFor-b.goalsAgainst)-(a.goalsFor-a.goalsAgainst) || b.goalsFor-a.goalsFor || a.team.name.localeCompare(b.team.name)).map((row, index) => ({ ...row, rank: index + 1, goalDiff: row.goalsFor - row.goalsAgainst }));
}
