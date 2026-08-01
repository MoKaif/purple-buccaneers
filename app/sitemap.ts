import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const routes = ['', '/events', '/league', '/members', '/gallery', '/hall-of-fame', '/about'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/league' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
