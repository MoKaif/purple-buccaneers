import { NextResponse } from 'next/server';
import { getActiveSeason } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getActiveSeason();
  return NextResponse.json(data);
}
