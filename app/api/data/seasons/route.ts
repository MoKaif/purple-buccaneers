import { NextResponse } from 'next/server';
import { getSeasons } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getSeasons();
  return NextResponse.json(data);
}
