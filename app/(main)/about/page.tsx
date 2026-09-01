import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
import { getSettings } from '@/lib/queries';
import { DEFAULT_DISCORD_INVITE } from '@/lib/site';
import { AboutClient } from './about-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About — Purple Buccaneers',
  description: 'The story behind the Purple Buccaneers gaming community — who we are and what we play.',
  openGraph: {
    title: 'About — Purple Buccaneers',
    description: 'The story behind the Purple Buccaneers gaming community — who we are and what we play.',
  },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="About" subtitle="The story behind the Purple Buccaneers." />
      <AboutClient discordUrl={settings?.discord_invite_url || DEFAULT_DISCORD_INVITE} />
    </div>
  );
}
