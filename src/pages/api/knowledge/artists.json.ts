import type { APIRoute } from 'astro';
import { getArtists, getMovements, getArtistMovements } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  const artists = await getArtists();
  const movements = await getMovements();

  const data = await Promise.all(artists.map(async (a) => {
    const movIds = await getArtistMovements(a.id);
    const movs = movements.filter(m => movIds.includes(m.id));
    return {
      "@type": "Person",
      name: a.name,
      alternateName: a.name_ar || undefined,
      birthDate: a.birth_year,
      deathDate: a.death_year || undefined,
      nationality: "Moroccan",
      description: a.biography_short,
      biography: a.biography,
      movements: movs.map(m => ({ name: m.name, period: `${m.period_start}–${m.period_end || 'present'}` })),
      url: `https://moroccoartguide.com/artists/${a.slug}`,
      website: a.website_url || undefined,
    };
  }));

  return new Response(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Moroccan Artists",
    description: `${artists.length} Moroccan artists documented by Morocco Art Guide`,
    numberOfItems: artists.length,
    publisher: { "@type": "Organization", name: "Morocco Art Guide", url: "https://moroccoartguide.com" },
    itemListElement: data.map((d, i) => ({ "@type": "ListItem", position: i + 1, item: d })),
  }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
