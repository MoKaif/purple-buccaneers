# Purple Buccaneers

Community hub for the Purple Buccaneers gaming community — events, a FIFA league
with auto-calculated standings, member profiles, gallery, and hall of fame, with
an admin portal for editing all of it.

Built with Next.js 13 (App Router), Tailwind, shadcn/ui, and Supabase.

## Local development

```bash
npm install
cp .env.example .env     # then fill in your Supabase values
npm run dev
```

The site runs at http://localhost:3000. To reach it from another device on your
network, bind to all interfaces:

```bash
npx next dev -H 0.0.0.0 -p 3001
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | production | Public origin, used by `sitemap.xml` and `robots.txt`. Falls back to `http://localhost:3000`. |

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel — the framework preset is detected automatically; no
   build configuration is needed.
3. Add all three environment variables above under **Settings → Environment
   Variables**.
4. Deploy.

## How data flows

Public pages are **server components** that query Supabase directly through
`lib/queries.ts` and re-render on a 60-second ISR window (`export const
revalidate = 60`). Admin edits therefore appear on the live site within a
minute, without a redeploy.

The `/api/data/*` routes expose the same queries as a read-only JSON API. They
are no longer used by the site's own pages but are kept for external consumers.

Live Discord member and presence counts come from `lib/discord.ts`, which reads
Discord's public invite endpoint. If that call fails, the stored `stat_members`
and `stat_online` values from the settings table are used instead.

## Known limitations

The admin portal is **not securely authenticated**. Credentials are hardcoded in
`lib/admin-auth.tsx` and ship in the client bundle, the `/api/admin/*` routes
perform no authorization check, and the Supabase RLS policies in
`supabase/migrations/` grant full read/write to the `anon` role. Anyone who can
reach the site can modify the database. This needs to be replaced with Supabase
Auth plus scoped RLS policies before the site is treated as public.
