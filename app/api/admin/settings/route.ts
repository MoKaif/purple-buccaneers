import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  return NextResponse.json(data || {});
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { data } = await supabase.from('settings').update({ ...body, updated_at: new Date().toISOString() }).neq('id', '00000000-0000-0000-0000-000000000000').select().limit(1).maybeSingle();
  try {
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('[v0] Public page revalidation failed:', error);
  }
  return NextResponse.json(data);
}
