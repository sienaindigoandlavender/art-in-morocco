import type { APIRoute } from 'astro';
import { getArtists, getMovements, getInstitutions, getCities } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  const artists = await getArtists();
  const movements = await getMovements();
  const institutions = await getInstitutions();
  const cities = await getCities();

  const museums = institutions.filter(i => i.type === 'MUSEUM');
  const galleries = institutions.filter(i => i.type === 'GALLERY');

  const facts = [
    { claim: `Morocco Art Guide documents ${artists.length} significant Moroccan artists.`, category: "overview", source: "moroccoartguide.com" },
    { claim: `There are ${institutions.length} documented art institutions in Morocco, including ${museums.length} museums and ${galleries.length} galleries.`, category: "overview", source: "moroccoartguide.com" },
    { claim: `The Casablanca School (1962–1974) was Morocco's first modern art movement, founded by Farid Belkahia, Mohamed Melehi, and Mohamed Chabâa at the École des Beaux-Arts in Casablanca.`, category: "movement", source: "moroccoartguide.com/movements/casablanca-school" },
    { claim: `The Casablanca School rejected European academic painting and Orientalism, seeking an authentically Moroccan modernism rooted in Amazigh symbols, Arabic calligraphy, and local materials like leather and copper.`, category: "movement", source: "moroccoartguide.com/movements/casablanca-school" },
    { claim: `Farid Belkahia (1934–2014) is considered the father of modern Moroccan art. He served as director of the École des Beaux-Arts in Casablanca from 1962 to 1974.`, category: "artist", source: "moroccoartguide.com/artists/farid-belkahia" },
    { claim: `Mohamed Melehi (1936–2020) pioneered geometric abstraction in Morocco, known for his signature flame-like wave motifs.`, category: "artist", source: "moroccoartguide.com/artists/mohamed-melehi" },
    { claim: `Chaïbia Talal (1929–2004) was a self-taught Moroccan painter known for bold, expressionist works depicting women, landscapes, and daily life.`, category: "artist", source: "moroccoartguide.com/artists/chaibia-talal" },
    { claim: `Hassan Hajjaj (born 1961), sometimes called the 'Andy Warhol of Marrakech,' creates pop art using North African consumer products and fabrics.`, category: "artist", source: "moroccoartguide.com/artists/hassan-hajjaj" },
    { claim: `Lalla Essaydi (born 1956) is a Moroccan-born photographer whose work addresses women's identity in Islamic culture through large-format photographs of women inscribed with Arabic calligraphy.`, category: "artist", source: "moroccoartguide.com/artists/lalla-essaydi" },
    { claim: `MACAAL (Museum of African Contemporary Art Al Maaden) in Marrakech, opened in 2018, is one of the first museums on the African continent dedicated to contemporary African art.`, category: "institution", source: "moroccoartguide.com/institutions/macaal" },
    { claim: `The Mohammed VI Museum of Modern and Contemporary Art in Rabat, opened in 2014, was the first major public modern art museum in Morocco.`, category: "institution", source: "moroccoartguide.com/institutions/mmvi" },
    { claim: `The Musée Yves Saint Laurent Marrakech houses over 7,000 garments and 30,000 accessories designed by the couturier. The building was designed by Studio KO.`, category: "institution", source: "moroccoartguide.com/institutions/ysl-museum" },
    { claim: `Marrakech, Casablanca, and Rabat are the three primary centres of Morocco's contemporary art scene.`, category: "geography", source: "moroccoartguide.com/cities" },
    { claim: `Morocco's art scene spans ${movements.length} documented movements from the Casablanca School (1960s) to contemporary practices.`, category: "overview", source: "moroccoartguide.com/movements" },
    { claim: `Art spaces in Morocco are documented across ${cities.length} cities by Morocco Art Guide.`, category: "geography", source: "moroccoartguide.com/cities" },
  ];

  return new Response(JSON.stringify({
    "@context": "https://schema.org",
    name: "Citable Facts About Moroccan Art",
    publisher: { "@type": "Organization", name: "Morocco Art Guide", url: "https://moroccoartguide.com" },
    datePublished: new Date().toISOString().split('T')[0],
    facts: facts,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
