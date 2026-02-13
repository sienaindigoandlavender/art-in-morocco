import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SITE_ID = 'morocco-art-guide';
let _supabase: SupabaseClient | null = null;
let _nexus: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';
    if (!url || !key) throw new Error('Art Guide Supabase credentials not configured');
    _supabase = createClient(url, key);
  }
  return _supabase;
}

function getNexus(): SupabaseClient {
  if (!_nexus) {
    const url = import.meta.env.NEXUS_SUPABASE_URL || process.env.NEXUS_SUPABASE_URL || '';
    const key = import.meta.env.NEXUS_SUPABASE_ANON_KEY || process.env.NEXUS_SUPABASE_ANON_KEY || '';
    if (!url || !key) throw new Error('Nexus Supabase credentials not configured');
    _nexus = createClient(url, key);
  }
  return _nexus;
}

// Types
export interface Artist {
  id: string; slug: string; name: string; name_ar: string | null;
  birth_year: number | null; death_year: number | null;
  biography_short: string | null; biography: string | null;
  active_period_start: number | null; active_period_end: number | null;
  photo_url: string | null; website_url: string | null;
  status: string; primary_object_type_id: string | null;
}

export interface Artwork {
  id: string; slug: string; title: string; title_ar: string | null;
  artist_id: string | null; year: number | null; year_end: number | null;
  description: string | null; dimensions: string | null; materials: string | null;
  current_location: string | null; image_url: string | null;
  is_iconic: boolean; movement_id: string | null; status: string;
  object_type_id: string | null; genre_id: string | null;
}

export interface Movement {
  id: string; slug: string; name: string; name_ar: string | null;
  description: string | null; period_start: number | null; period_end: number | null;
}

export interface Institution {
  id: string; slug: string; name: string; name_ar: string | null;
  type: string | null; city_id: string | null; address: string | null;
  description: string | null; description_long: string | null;
  website: string | null; phone: string | null; email: string | null;
  hours: string | null; admission: string | null;
  latitude: number | null; longitude: number | null;
  year_established: number | null; highlights: string | null; status: string;
}

export interface City {
  id: string; slug: string; name: string; name_ar: string | null;
  region: string | null; description: string | null;
  latitude: number | null; longitude: number | null;
}

export interface Theme { id: string; slug: string; name: string; description: string | null; }
export interface ObjectType { id: string; slug: string; name: string; description: string | null; }
export interface Genre { id: string; slug: string; name: string; description: string | null; }

// Site data queries
export async function getArtists(): Promise<Artist[]> {
  const { data, error } = await getSupabase().from('artists').select('*').eq('status', 'published').order('name');
  if (error) { console.error('[Art] Artists error:', error.message); return []; }
  return data as Artist[];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const { data, error } = await getSupabase().from('artists').select('*').eq('slug', slug).eq('status', 'published').single();
  if (error) return null;
  return data as Artist;
}

export async function getArtworks(): Promise<Artwork[]> {
  const { data, error } = await getSupabase().from('artworks').select('*').eq('status', 'published').order('year');
  if (error) { console.error('[Art] Artworks error:', error.message); return []; }
  return data as Artwork[];
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const { data, error } = await getSupabase().from('artworks').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Artwork;
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
  const { data, error } = await getSupabase().from('artworks').select('*').eq('artist_id', artistId).eq('status', 'published').order('year');
  if (error) return [];
  return data as Artwork[];
}

export async function getMovements(): Promise<Movement[]> {
  const { data, error } = await getSupabase().from('movements').select('*').order('period_start');
  if (error) { console.error('[Art] Movements error:', error.message); return []; }
  return data as Movement[];
}

export async function getMovementBySlug(slug: string): Promise<Movement | null> {
  const { data, error } = await getSupabase().from('movements').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Movement;
}

export async function getInstitutions(): Promise<Institution[]> {
  const { data, error } = await getSupabase().from('institutions').select('*').order('name');
  if (error) { console.error('[Art] Institutions error:', error.message); return []; }
  return data as Institution[];
}

export async function getInstitutionBySlug(slug: string): Promise<Institution | null> {
  const { data, error } = await getSupabase().from('institutions').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Institution;
}

export async function getCities(): Promise<City[]> {
  const { data, error } = await getSupabase().from('cities').select('*').order('name');
  if (error) return [];
  return data as City[];
}

export async function getThemes(): Promise<Theme[]> {
  const { data, error } = await getSupabase().from('themes').select('*').order('name');
  if (error) return [];
  return data as Theme[];
}

export async function getObjectTypes(): Promise<ObjectType[]> {
  const { data, error } = await getSupabase().from('object_types').select('*').order('name');
  if (error) return [];
  return data as ObjectType[];
}

export async function getMovementArtists(movementId: string): Promise<string[]> {
  const { data } = await getSupabase().from('artist_movements').select('artist_id').eq('movement_id', movementId);
  return data?.map(r => r.artist_id) || [];
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await getSupabase().from('site_settings').select('*');
  if (error) { console.error('[Art] Settings error:', error.message); return {}; }
  const s: Record<string, string> = {};
  data?.forEach((r: { key: string; value: string }) => { s[r.key] = r.value; });
  return s;
}

// Nexus
export interface NexusSite {
  site_id: string; site_name: string; site_url: string;
  legal_entity: string; contact_email: string;
  jurisdiction_country: string; jurisdiction_city: string;
  address_line1: string; address_line2: string;
}

export interface NexusFooterLink {
  brand_id: string; column_number: number; column_title: string;
  link_order: number; link_label: string; link_href: string; link_type: string;
}

export async function getNexusSite(): Promise<NexusSite | null> {
  const { data, error } = await getNexus().from('nexus_sites').select('*').eq('site_id', SITE_ID).single();
  if (error) return null;
  return data as NexusSite;
}

export async function getNexusLegalPages(): Promise<{ page_id: string; page_title: string }[]> {
  const { data, error } = await getNexus().from('nexus_legal_pages').select('page_id, page_title').order('page_id');
  if (error) return [];
  const unique = new Map<string, string>();
  data?.forEach((r: { page_id: string; page_title: string }) => unique.set(r.page_id, r.page_title));
  return Array.from(unique.entries()).map(([page_id, page_title]) => ({ page_id, page_title }));
}

export async function getNexusLegalPage(pageId: string): Promise<{ section_title: string; section_content: string }[]> {
  const site = await getNexusSite();
  const { data, error } = await getNexus().from('nexus_legal_pages').select('section_title, section_content').eq('page_id', pageId).order('section_order');
  if (error || !data) return [];
  return data.map((s: { section_title: string; section_content: string }) => ({
    section_title: s.section_title,
    section_content: resolveVars(s.section_content, site),
  }));
}

function resolveVars(text: string, site: NexusSite | null): string {
  if (!site || !text) return text;
  return text
    .replace(/\{\{site_name\}\}/g, site.site_name)
    .replace(/\{\{site_url\}\}/g, site.site_url)
    .replace(/\{\{legal_entity\}\}/g, site.legal_entity)
    .replace(/\{\{contact_email\}\}/g, site.contact_email)
    .replace(/\{\{jurisdiction_country\}\}/g, site.jurisdiction_country)
    .replace(/\{\{jurisdiction_city\}\}/g, site.jurisdiction_city)
    .replace(/\{\{address_line1\}\}/g, site.address_line1)
    .replace(/\{\{address_line2\}\}/g, site.address_line2);
}

export async function getNexusFooterLinks(): Promise<NexusFooterLink[]> {
  const { data, error } = await getNexus().from('nexus_footer_links').select('*').eq('brand_id', SITE_ID).order('column_number').order('link_order');
  if (error) return [];
  return data as NexusFooterLink[];
}

export async function getNexusPoweredBy(): Promise<{ powered_by_name: string; powered_by_url: string; show_powered_by: boolean } | null> {
  const { data, error } = await getNexus().from('nexus_powered_by').select('*').eq('site_id', SITE_ID).single();
  if (error) return null;
  return data;
}
