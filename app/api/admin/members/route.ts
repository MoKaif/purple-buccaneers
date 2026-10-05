import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';

function databaseError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : 'Supabase request failed';
  console.error('[v0] Supabase members request failed:', error);
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('members').select('*').order('sort_order', { ascending: true });
    if (error) return databaseError(error);
    return NextResponse.json(data || []);
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('members').insert(body).select().single();
    if (error) return databaseError(error, 400);
    try {
      revalidatePath('/', 'layout');
    } catch (error) {
      console.error('[v0] Public page revalidation failed:', error);
    }
    return NextResponse.json(data);
  } catch (error) {
    return databaseError(error, 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Member id is required' }, { status: 400 });
    const body = await req.json();
    const { data, error } = await supabase.from('members').update(body).eq('id', id).select().single();
    if (error) return databaseError(error, 400);
    try {
      revalidatePath('/', 'layout');
    } catch (error) {
      console.error('[v0] Public page revalidation failed:', error);
    }
    return NextResponse.json(data);
  } catch (error) {
    return databaseError(error, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Member id is required' }, { status: 400 });
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) return databaseError(error, 400);
    try {
      revalidatePath('/', 'layout');
    } catch (error) {
      console.error('[v0] Public page revalidation failed:', error);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return databaseError(error);
  }
}
