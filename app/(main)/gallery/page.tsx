import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/section-heading';
import { getGallery } from '@/lib/queries';
import { GalleryClient } from './gallery-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Gallery — Purple Buccaneers',
  description: 'Tournament posters, screenshots, community moments, and winner images.',
  openGraph: {
    title: 'Gallery — Purple Buccaneers',
    description: 'Tournament posters, screenshots, community moments, and winner images.',
  },
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div>
      <PageHeader title="Gallery" subtitle="Tournament posters, screenshots, community moments, and winner images." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GalleryClient items={items} />
      </section>
    </div>
  );
}
