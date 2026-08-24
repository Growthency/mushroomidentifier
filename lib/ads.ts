/**
 * Adify — shared types, constants and helpers for the ad-management system.
 *
 * Used by both the admin UI (/admin/adify) and the public-facing renderer
 * (components/adify/*). Ad-network snippets (Adsterra etc.) are stored and
 * rendered VERBATIM — nothing here rewrites the ad code.
 */

export type AdPlacement =
  | 'header'
  | 'content_top'
  | 'in_content'
  | 'content_bottom'
  | 'sidebar'
  | 'footer'
  | 'sticky'

export type AdPageType = 'all' | 'home' | 'article'

export interface AdUnit {
  id: string
  name: string
  code: string
  width: number
  height: number
  placement: AdPlacement
  paragraph_number: number
  page_types: AdPageType[]
  show_desktop: boolean
  show_mobile: boolean
  lazy_load: boolean
  enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

/** The public payload the frontend provider needs to render an ad. */
export type PublicAdUnit = Pick<
  AdUnit,
  | 'id' | 'name' | 'code' | 'width' | 'height' | 'placement'
  | 'paragraph_number' | 'page_types' | 'show_desktop' | 'show_mobile'
  | 'lazy_load' | 'sort_order'
>

export const AD_PLACEMENTS: AdPlacement[] = [
  'header', 'content_top', 'in_content', 'content_bottom',
  'sidebar', 'footer', 'sticky',
]

export const PLACEMENT_LABELS: Record<AdPlacement, string> = {
  header:         'Header strip',
  content_top:    'Top of article',
  in_content:     'In-content (after paragraph)',
  content_bottom: 'End of article',
  sidebar:        'Sidebar',
  footer:         'Footer strip',
  sticky:         'Sticky bottom bar',
}

export const PLACEMENT_HELP: Record<AdPlacement, string> = {
  header:         'Full-width strip directly under the top navigation, on every page.',
  content_top:    'Above the first heading of an article — high-viewability, above the fold.',
  in_content:     'Inserted between paragraphs inside the article body. Best-performing slot.',
  content_bottom: 'At the very end of the article body.',
  sidebar:        'Inside the right rail on article & species pages (desktop).',
  footer:         'Full-width strip directly above the site footer, on every page.',
  sticky:         'Anchored to the bottom of the screen as the user scrolls. Great for mobile.',
}

export const PAGE_TYPE_LABELS: Record<AdPageType, string> = {
  all:     'All pages',
  home:    'Homepage',
  article: 'Articles & guides',
}

/**
 * Parse the width/height out of a pasted Adsterra "iframe" snippet, e.g.
 *   atOptions = { 'key':'…', 'format':'iframe', 'height':250, 'width':300, … }
 * Falls back to a 300x250 box if it can't be detected.
 */
export function detectAdSize(code: string): { width: number; height: number } {
  const w = code.match(/['"]?width['"]?\s*:\s*(\d{2,4})/i)
  const h = code.match(/['"]?height['"]?\s*:\s*(\d{2,4})/i)
  const width = w ? parseInt(w[1], 10) : 300
  const height = h ? parseInt(h[1], 10) : 250
  return {
    width: Number.isFinite(width) && width > 0 ? width : 300,
    height: Number.isFinite(height) && height > 0 ? height : 250,
  }
}

/** Does an ad unit match the current page type? */
export function matchesPageType(
  pageTypes: AdPageType[] | null | undefined,
  current: Exclude<AdPageType, 'all'>,
): boolean {
  if (!pageTypes || pageTypes.length === 0) return true
  return pageTypes.includes('all') || pageTypes.includes(current)
}

/** Which page type is the given pathname? */
export function pageTypeForPath(pathname: string | null): Exclude<AdPageType, 'all'> {
  if (!pathname || pathname === '/') return 'home'
  return 'article'
}
