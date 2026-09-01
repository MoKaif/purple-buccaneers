import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
import { getEvents } from '@/lib/queries';
import { EventsClient } from './events-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events — Purple Buccaneers',
  description: 'Upcoming and past Purple Buccaneers community events, tournaments, and game nights.',
  openGraph: {
    title: 'Events — Purple Buccaneers',
    description: 'Upcoming and past Purple Buccaneers community events, tournaments, and game nights.',
  },
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <PageHeader title="Events" subtitle="Upcoming and past community gatherings. Join us for the next one." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventsClient events={events} />
      </section>
    </div>
  );
}
