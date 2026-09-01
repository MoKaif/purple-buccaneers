import { NextResponse } from 'next/server';
import { getGallery } from '@/lib/queries';

export const revalidate = 60;

export async function GET() {
  const data = await getGallery();
  return NextResponse.json(data);
}
