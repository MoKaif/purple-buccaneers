import { NextResponse } from 'next/server';
import { getAllMembers } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getAllMembers();
  return NextResponse.json(data);
}
