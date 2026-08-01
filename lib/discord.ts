export interface DiscordStats {
  memberCount: number | null;
  onlineCount: number | null;
  guildName: string | null;
  live: boolean;
}

const EMPTY: DiscordStats = {
  memberCount: null,
  onlineCount: null,
  guildName: null,
  live: false,
};

/** Pulls the invite code out of any discord.gg / discord.com/invite URL form. */
export function parseInviteCode(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : url.trim().replace(/^\/+|\/+$/g, '') || null;
}

/**
 * Live guild stats from Discord's public invite endpoint. No bot token needed —
 * `with_counts` returns approximate member/presence counts for any valid invite.
 * Returns `live: false` on any failure so callers can fall back to stored values.
 */
export async function getDiscordStats(inviteUrl: string | null): Promise<DiscordStats> {
  const code = parseInviteCode(inviteUrl);
  if (!code) return EMPTY;

  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(code)}?with_counts=true`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return EMPTY;

    const data = await res.json();
    const memberCount = data?.approximate_member_count ?? null;
    const onlineCount = data?.approximate_presence_count ?? null;
    if (memberCount === null && onlineCount === null) return EMPTY;

    return {
      memberCount,
      onlineCount,
      guildName: data?.guild?.name ?? null,
      live: true,
    };
  } catch {
    return EMPTY;
  }
}
