import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/queries';
import { getActiveSeason } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const season = await getActiveSeason();
  const data = await getMatches(season?.id);
  return NextResponse.json(data);
}
