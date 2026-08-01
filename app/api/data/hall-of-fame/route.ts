import { NextResponse } from 'next/server';
import { getHallOfFame } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getHallOfFame();
  return NextResponse.json(data);
}
