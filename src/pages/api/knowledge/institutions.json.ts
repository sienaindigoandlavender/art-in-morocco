import type { APIRoute } from 'astro';
import { getInstitutions, getCities } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  const institutions = await getInstitutions();
  const cities = await getCities();
  const cityMap = new Map(cities.map(c => [c.id, c.name]));
  cities.forEach(c => cityMap.set(`city-${c.slug}`, c.name));

  const data = institutions.map(i => {
    const schemaType = i.type === 'MUSEUM' ? 'Museum' : i.type === 'GALLERY' ? 'ArtGallery' : 'CivicStructure';
    return {
      "@type": schemaType,
      name: i.name,
      alternateName: i.name_ar || undefined,
      category: i.type,
      city: i.city_id ? cityMap.get(i.city_id) : undefined,
      description: i.description,
      address: i.address || undefined,
      openingHours: i.hours || undefined,
      admission: i.admission || undefined,
      telephone: i.phone || undefined,
      email: i.email || undefined,
      url: i.website || undefined,
      geo: i.latitude && i.longitude ? { latitude: i.latitude, longitude: i.longitude } : undefined,
      yearEstablished: i.year_established || undefined,
      pageUrl: `https://moroccoartguide.com/institutions/${i.slug}`,
    };
  });

  return new Response(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Art Institutions in Morocco",
    description: `${institutions.length} museums, galleries, residencies, and cultural centres in Morocco`,
    numberOfItems: institutions.length,
    publisher: { "@type": "Organization", name: "Morocco Art Guide", url: "https://moroccoartguide.com" },
    itemListElement: data.map((d, i) => ({ "@type": "ListItem", position: i + 1, item: d })),
  }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
