import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getSettings();
  return NextResponse.json(data);
}
