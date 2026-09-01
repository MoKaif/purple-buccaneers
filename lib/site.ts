/**
 * Fallback invite, used only when `settings.discord_invite_url` is empty.
 * Everything user-facing should prefer the DB value so the admin portal's
 * Discord field actually takes effect.
 */
export const DEFAULT_DISCORD_INVITE = 'https://discord.gg/cwPmCQbxdx';

export const SITE_NAME = 'Purple Buccaneers';

/** Public origin, used for canonical URLs and sitemap entries. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
