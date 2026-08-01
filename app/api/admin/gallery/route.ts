import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = await supabase.from('gallery').insert(body).select().single();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const body = await req.json();
  const { data } = await supabase.from('gallery').update(body).eq('id', id).select().single();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  await supabase.from('gallery').delete().eq('id', id);
  return NextResponse.json({ success: true });
}
