import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin portal has no business in search results.
      disallow: ['/admin-portal', '/admin-portal/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
