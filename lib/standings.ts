import type { LeagueMatch, LeaguePlayer, StandingRow, PlayerStats } from './types';

export function calculateStandings(
  matches: LeagueMatch[],
  players: LeaguePlayer[]
): StandingRow[] {
  const completed = matches.filter((m) => m.status === 'completed');
  const rows = new Map<string, StandingRow>();

  for (const player of players) {
    if (!player.id) continue;
    rows.set(player.id, {
      playerId: player.id,
      username: player.username,
      avatarUrl: player.avatar_url,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  }

  for (const match of completed) {
    const home = match.home_player_id;
    const away = match.away_player_id;
    if (!home || !away) continue;

    const homeRow = rows.get(home);
    const awayRow = rows.get(away);
    if (!homeRow || !awayRow) continue;

    homeRow.played++;
    awayRow.played++;
    homeRow.goalsFor += match.home_score;
    homeRow.goalsAgainst += match.away_score;
    awayRow.goalsFor += match.away_score;
    awayRow.goalsAgainst += match.home_score;

    if (match.home_score > match.away_score) {
      homeRow.wins++;
      homeRow.points += 3;
      awayRow.losses++;
      homeRow.form.push('W');
      awayRow.form.push('L');
    } else if (match.home_score < match.away_score) {
      awayRow.wins++;
      awayRow.points += 3;
      homeRow.losses++;
      awayRow.form.push('W');
      homeRow.form.push('L');
    } else {
      homeRow.draws++;
      awayRow.draws++;
      homeRow.points += 1;
      awayRow.points += 1;
      homeRow.form.push('D');
      awayRow.form.push('D');
    }
  }

  const result = Array.from(rows.values());
  for (const row of result) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    row.form = row.form.slice(-5);
  }

  result.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.username.localeCompare(b.username);
  });

  return result;
}

export function calculatePlayerStats(
  playerId: string,
  matches: LeagueMatch[],
  players: LeaguePlayer[]
): PlayerStats | null {
  const player = players.find((p) => p.id === playerId);
  if (!player) return null;

  const completed = matches.filter(
    (m) => m.status === 'completed' && (m.home_player_id === playerId || m.away_player_id === playerId)
  );

  let wins = 0;
  let losses = 0;
  let draws = 0;
  let goals = 0;
  const form: ('W' | 'D' | 'L')[] = [];

  for (const match of completed) {
    const isHome = match.home_player_id === playerId;
    const myScore = isHome ? match.home_score : match.away_score;
    const oppScore = isHome ? match.away_score : match.home_score;

    goals += myScore;

    if (myScore > oppScore) {
      wins++;
      form.push('W');
    } else if (myScore < oppScore) {
      losses++;
      form.push('L');
    } else {
      draws++;
      form.push('D');
    }
  }

  return {
    playerId,
    username: player.username,
    avatarUrl: player.avatar_url,
    wins,
    losses,
    draws,
    goals,
    // Assists are not part of the match schema. Keep this honest until they are tracked.
    assists: 0,
    form: form.slice(-5),
    achievements: player.achievements || [],
    played: completed.length,
  };
}
