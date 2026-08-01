export interface Settings {
  id: string;
  site_name: string;
  tagline: string;
  discord_invite_url: string;
  welcome_message: string;
  stat_members: number;
  stat_online: number;
  stat_seasons: number;
  stat_matches: number;
  stat_goals: number;
  stat_events: number;
  current_season_id: string | null;
  updated_at: string;
}

export interface Member {
  id: string;
  username: string;
  discord_id: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  badges: string[];
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string | null;
  type: string;
  icon: string | null;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  banner_url: string | null;
  description: string | null;
  event_date: string;
  status: string;
  is_featured: boolean;
  created_at: string;
}

export interface LeagueSeason {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  current_week: number;
  created_at: string;
}

export interface LeaguePlayer {
  id: string;
  username: string;
  avatar_url: string | null;
  season_id: string | null;
  achievements: string[];
  created_at: string;
}

export interface LeagueMatch {
  id: string;
  season_id: string | null;
  week: number;
  home_player_id: string | null;
  away_player_id: string | null;
  home_score: number;
  away_score: number;
  status: string;
  match_date: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface HallOfFame {
  id: string;
  season_name: string;
  champion: string | null;
  golden_boot: string | null;
  best_defense: string | null;
  mvp: string | null;
  highest_scoring_match: string | null;
  notes: string | null;
  created_at: string;
}

export interface StandingRow {
  playerId: string;
  username: string;
  avatarUrl: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface PlayerStats {
  playerId: string;
  username: string;
  avatarUrl: string | null;
  wins: number;
  losses: number;
  goals: number;
  assists: number;
  form: ('W' | 'D' | 'L')[];
  achievements: string[];
  played: number;
  draws: number;
}
