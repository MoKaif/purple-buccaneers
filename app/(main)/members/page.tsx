import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
import { getAllMembers } from '@/lib/queries';
import { MembersClient } from './members-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Members — Purple Buccaneers',
  description: 'Meet the crew of the Purple Buccaneers gaming community.',
  openGraph: {
    title: 'Members — Purple Buccaneers',
    description: 'Meet the crew of the Purple Buccaneers gaming community.',
  },
};

export default async function MembersPage() {
  const members = await getAllMembers();

  return (
    <div>
      <PageHeader title="Members" subtitle="The crew of the Purple Buccaneers. Meet the people behind the community." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MembersClient members={members} />
      </section>
    </div>
  );
}
