import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase.from('league_players').select('*').order('username', { ascending: true });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = await supabase.from('league_players').insert(body).select().single();
  try {
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('[v0] Public page revalidation failed:', error);
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const body = await req.json();
  const { data } = await supabase.from('league_players').update(body).eq('id', id).select().single();
  try {
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('[v0] Public page revalidation failed:', error);
  }
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  await supabase.from('league_players').delete().eq('id', id);
  try {
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('[v0] Public page revalidation failed:', error);
  }
  return NextResponse.json({ success: true });
}
