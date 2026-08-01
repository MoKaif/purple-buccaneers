import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getMatches();
  return NextResponse.json(data);
}
