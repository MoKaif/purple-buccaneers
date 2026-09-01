import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getEvents();
  return NextResponse.json(data);
}
