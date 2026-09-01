import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/queries';
import { getActiveSeason } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const season = await getActiveSeason();
  const data = await getPlayers(season?.id);
  return NextResponse.json(data);
}
