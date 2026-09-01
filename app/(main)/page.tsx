import {
  getSettings,
  getFeaturedMembers,
  getAnnouncements,
  getFeaturedEvent,
  getActiveSeason,
  getPlayers,
  getMatches,
} from '@/lib/queries';
import { getDiscordStats } from '@/lib/discord';
import { DEFAULT_DISCORD_INVITE } from '@/lib/site';
import { HomeClient } from './home-client';

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSettings();
  const activeSeason = await getActiveSeason();

  const [members, announcements, featuredEvent, players, matches, discord] = await Promise.all([
    getFeaturedMembers(),
    getAnnouncements(),
    getFeaturedEvent(),
    activeSeason ? getPlayers(activeSeason.id) : Promise.resolve([]),
    activeSeason ? getMatches(activeSeason.id) : Promise.resolve([]),
    getDiscordStats(settings?.discord_invite_url ?? DEFAULT_DISCORD_INVITE),
  ]);

  return (
    <HomeClient
      settings={settings}
      members={members}
      announcements={announcements}
      featuredEvent={featuredEvent}
      season={activeSeason}
      players={players}
      matches={matches}
      discord={discord}
      discordUrl={settings?.discord_invite_url || DEFAULT_DISCORD_INVITE}
    />
  );
}
