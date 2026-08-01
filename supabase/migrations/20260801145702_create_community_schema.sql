/*
# Purple Buccaneers Community Hub - Database Schema

1. Overview
Creates the complete schema for the Purple Buccaneers community website.
This is a single-tenant community site: the public website reads all data
anonymously, and a hidden admin panel (simple password auth) manages it.

2. New Tables
- `settings` — single-row config for homepage content, stats, discord invite, etc.
- `members` — community member directory (avatar, username, role, bio, badges)
- `announcements` — latest activity / timeline items
- `events` — community events (title, banner, description, date, status)
- `league_players` — FIFA league player profiles
- `league_matches` — FIFA match results (used to auto-calculate standings)
- `league_seasons` — season metadata (name, start, end, status)
- `gallery` — image gallery items
- `hall_of_fame` — per-season awards archive

3. Security
- RLS enabled on all tables.
- All tables allow anon + authenticated CRUD (intentionally public/shared data
  for a single-tenant community site managed via a hidden admin panel).
*/

-- Settings (single row, key-value style but stored as columns for simplicity)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Purple Buccaneers',
  tagline text NOT NULL DEFAULT 'A premium gaming community',
  discord_invite_url text NOT NULL DEFAULT 'https://discord.gg/cwPmCQbxdx',
  welcome_message text NOT NULL DEFAULT 'Welcome to our community hub.',
  stat_members integer NOT NULL DEFAULT 18,
  stat_online integer NOT NULL DEFAULT 7,
  stat_seasons integer NOT NULL DEFAULT 4,
  stat_matches integer NOT NULL DEFAULT 120,
  stat_goals integer NOT NULL DEFAULT 340,
  stat_events integer NOT NULL DEFAULT 25,
  current_season_id uuid,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_settings" ON settings;
CREATE POLICY "anon_select_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_settings" ON settings;
CREATE POLICY "anon_insert_settings" ON settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_settings" ON settings;
CREATE POLICY "anon_update_settings" ON settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_settings" ON settings;
CREATE POLICY "anon_delete_settings" ON settings FOR DELETE TO anon, authenticated USING (true);

-- Members
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  discord_id text,
  avatar_url text,
  role text NOT NULL DEFAULT 'Member',
  bio text,
  badges text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_members" ON members;
CREATE POLICY "anon_select_members" ON members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_members" ON members;
CREATE POLICY "anon_insert_members" ON members FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_members" ON members;
CREATE POLICY "anon_update_members" ON members FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_members" ON members;
CREATE POLICY "anon_delete_members" ON members FOR DELETE TO anon, authenticated USING (true);

-- Announcements (latest activity timeline)
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'update', -- match_result, event, tournament, update
  icon text DEFAULT 'activity',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_announcements" ON announcements;
CREATE POLICY "anon_select_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_announcements" ON announcements;
CREATE POLICY "anon_insert_announcements" ON announcements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_announcements" ON announcements;
CREATE POLICY "anon_update_announcements" ON announcements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_announcements" ON announcements;
CREATE POLICY "anon_delete_announcements" ON announcements FOR DELETE TO anon, authenticated USING (true);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  banner_url text,
  description text,
  event_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming', -- upcoming, live, ended
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE TO anon, authenticated USING (true);

-- League Seasons
CREATE TABLE IF NOT EXISTS league_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active', -- active, completed
  current_week integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE league_seasons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_league_seasons" ON league_seasons;
CREATE POLICY "anon_select_league_seasons" ON league_seasons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_league_seasons" ON league_seasons;
CREATE POLICY "anon_insert_league_seasons" ON league_seasons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_league_seasons" ON league_seasons;
CREATE POLICY "anon_update_league_seasons" ON league_seasons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_league_seasons" ON league_seasons;
CREATE POLICY "anon_delete_league_seasons" ON league_seasons FOR DELETE TO anon, authenticated USING (true);

-- League Players
CREATE TABLE IF NOT EXISTS league_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  avatar_url text,
  season_id uuid REFERENCES league_seasons(id) ON DELETE CASCADE,
  achievements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE league_players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_league_players" ON league_players;
CREATE POLICY "anon_select_league_players" ON league_players FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_league_players" ON league_players;
CREATE POLICY "anon_insert_league_players" ON league_players FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_league_players" ON league_players;
CREATE POLICY "anon_update_league_players" ON league_players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_league_players" ON league_players;
CREATE POLICY "anon_delete_league_players" ON league_players FOR DELETE TO anon, authenticated USING (true);

-- League Matches (results used to auto-calculate standings)
CREATE TABLE IF NOT EXISTS league_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES league_seasons(id) ON DELETE CASCADE,
  week integer NOT NULL DEFAULT 1,
  home_player_id uuid REFERENCES league_players(id) ON DELETE CASCADE,
  away_player_id uuid REFERENCES league_players(id) ON DELETE CASCADE,
  home_score integer NOT NULL DEFAULT 0,
  away_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled, completed
  match_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE league_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_league_matches" ON league_matches;
CREATE POLICY "anon_select_league_matches" ON league_matches FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_league_matches" ON league_matches;
CREATE POLICY "anon_insert_league_matches" ON league_matches FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_league_matches" ON league_matches;
CREATE POLICY "anon_update_league_matches" ON league_matches FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_league_matches" ON league_matches;
CREATE POLICY "anon_delete_league_matches" ON league_matches FOR DELETE TO anon, authenticated USING (true);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'community', -- poster, screenshot, moment, winner
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery;
CREATE POLICY "anon_insert_gallery" ON gallery FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery;
CREATE POLICY "anon_update_gallery" ON gallery FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery;
CREATE POLICY "anon_delete_gallery" ON gallery FOR DELETE TO anon, authenticated USING (true);

-- Hall of Fame
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_name text NOT NULL,
  champion text,
  golden_boot text,
  best_defense text,
  mvp text,
  highest_scoring_match text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hall_of_fame" ON hall_of_fame;
CREATE POLICY "anon_select_hall_of_fame" ON hall_of_fame FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hall_of_fame" ON hall_of_fame;
CREATE POLICY "anon_insert_hall_of_fame" ON hall_of_fame FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hall_of_fame" ON hall_of_fame;
CREATE POLICY "anon_update_hall_of_fame" ON hall_of_fame FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hall_of_fame" ON hall_of_fame;
CREATE POLICY "anon_delete_hall_of_fame" ON hall_of_fame FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_league_matches_season ON league_matches(season_id);
CREATE INDEX IF NOT EXISTS idx_league_players_season ON league_players(season_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);

-- Seed default settings row
INSERT INTO settings (id, site_name, tagline)
SELECT gen_random_uuid(), 'Purple Buccaneers', 'A premium gaming community'
WHERE NOT EXISTS (SELECT 1 FROM settings);
