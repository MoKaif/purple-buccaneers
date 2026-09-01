import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const select = async (table: string, columns: string, order: string) => {
    const response = await fetch(`${url}/rest/v1/${table}?select=${columns}&order=${order}`, { headers, cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${table}`);
    return response.json();
  };
  try {
    const [leagues, teams, fixtures] = await Promise.all([
      select("leagues", "id,name,season", "name.asc"),
      select("teams", "id,league_id,name,short_name", "name.asc"),
      select("fixtures", "id,league_id,home_team_id,away_team_id,kickoff_at,status,home_score,away_score,venue", "kickoff_at.asc"),
    ]);
    return NextResponse.json({ leagues, teams, fixtures });
  } catch (error) {
    console.error("[v0] League data request failed", error);
    return NextResponse.json({ error: "Unable to load league data" }, { status: 502 });
  }
}
