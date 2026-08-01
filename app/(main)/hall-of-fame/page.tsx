import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
import { getHallOfFame } from '@/lib/queries';
import { HallOfFameClient } from './hall-of-fame-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hall of Fame — Purple Buccaneers',
  description: 'Champions, golden boots, and MVPs from every past Purple Buccaneers season.',
  openGraph: {
    title: 'Hall of Fame — Purple Buccaneers',
    description: 'Champions, golden boots, and MVPs from every past Purple Buccaneers season.',
  },
};

export default async function HallOfFamePage() {
  const items = await getHallOfFame();

  return (
    <div>
      <PageHeader title="Hall of Fame" subtitle="Legends of past seasons. The champions, scorers, and defenders who made history." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <HallOfFameClient items={items} />
      </section>
    </div>
  );
}
