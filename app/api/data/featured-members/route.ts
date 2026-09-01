import { NextResponse } from 'next/server';
import { getFeaturedMembers } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getFeaturedMembers();
  return NextResponse.json(data);
}
