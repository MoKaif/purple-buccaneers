import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getPlayers();
  return NextResponse.json(data);
}
