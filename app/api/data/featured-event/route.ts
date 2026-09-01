import { NextResponse } from 'next/server';
import { getFeaturedEvent } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getFeaturedEvent();
  return NextResponse.json(data);
}
