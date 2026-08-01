import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getAnnouncements();
  return NextResponse.json(data);
}
