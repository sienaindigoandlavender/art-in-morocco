import type { APIRoute } from 'astro';
import { getArtists, getArtworks, getMovements, getInstitutions, getCities } from '../lib/supabase';

export const GET: APIRoute = async () => {
  const artists = await getArtists();
  const artworks = await getArtworks();
  const movements = await getMovements();
  const institutions = await getInstitutions();
  const cities = await getCities();

  const BASE = 'https://moroccoartguide.com';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/artists', priority: '0.9', changefreq: 'weekly' },
    { url: '/artworks', priority: '0.9', changefreq: 'weekly' },
    { url: '/movements', priority: '0.8', changefreq: 'monthly' },
    { url: '/institutions', priority: '0.9', changefreq: 'weekly' },
    { url: '/cities', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'yearly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${BASE}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${artists.map(a => `  <url>
    <loc>${BASE}/artists/${a.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${artworks.map(w => `  <url>
    <loc>${BASE}/artworks/${w.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${movements.map(m => `  <url>
    <loc>${BASE}/movements/${m.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${institutions.map(i => `  <url>
    <loc>${BASE}/institutions/${i.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${cities.map(c => `  <url>
    <loc>${BASE}/cities/${c.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
