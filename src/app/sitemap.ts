import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pandonia.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<[string, number]> = [
    ['', 1],
    ['/hvad-vi-maaler', 0.9],
    ['/saadan-fungerer-det', 0.8],
    ['/din-rapport', 0.8],
    ['/om-pandonia', 0.6],
    ['/book', 0.9],
    ['/faq', 0.5],
  ];
  return routes.map(([path, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  }));
}
