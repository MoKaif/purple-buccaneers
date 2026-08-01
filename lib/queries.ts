import { supabase } from './supabase';
import type {
  Settings, Member, Announcement, EventItem, LeagueSeason, LeaguePlayer, LeagueMatch, GalleryItem, HallOfFame
} from './types';

export async function getSettings(): Promise<Settings | null> {
  const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  return data as Settings | null;
}

export async function getFeaturedMembers(): Promise<Member[]> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  return (data as Member[]) || [];
}

export async function getAllMembers(): Promise<Member[]> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as Member[]) || [];
}

export async function getAnnouncements(limit = 8): Promise<Announcement[]> {
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Announcement[]) || [];
}

export async function getEvents(): Promise<EventItem[]> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  return (data as EventItem[]) || [];
}

export async function getFeaturedEvent(): Promise<EventItem | null> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .order('event_date', { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as EventItem) || null;
}

export async function getSeasons(): Promise<LeagueSeason[]> {
  const { data } = await supabase
    .from('league_seasons')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as LeagueSeason[]) || [];
}

export async function getActiveSeason(): Promise<LeagueSeason | null> {
  const { data } = await supabase
    .from('league_seasons')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as LeagueSeason) || null;
}

export async function getPlayers(seasonId?: string): Promise<LeaguePlayer[]> {
  let query = supabase.from('league_players').select('*');
  if (seasonId) query = query.eq('season_id', seasonId);
  const { data } = await query.order('username', { ascending: true });
  return (data as LeaguePlayer[]) || [];
}

export async function getMatches(seasonId?: string): Promise<LeagueMatch[]> {
  let query = supabase.from('league_matches').select('*');
  if (seasonId) query = query.eq('season_id', seasonId);
  const { data } = await query.order('week', { ascending: true });
  return (data as LeagueMatch[]) || [];
}

export async function getGallery(): Promise<GalleryItem[]> {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as GalleryItem[]) || [];
}

export async function getHallOfFame(): Promise<HallOfFame[]> {
  const { data } = await supabase
    .from('hall_of_fame')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as HallOfFame[]) || [];
}
