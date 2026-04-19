/**
 * Shared helpers for post content processing.
 */

/**
 * Extracts the `src` of the first `<img>` tag in an HTML blob.
 *
 * Used by the "auto featured image from content" fallback — when an admin
 * (or Writerfy) saves a post without explicitly setting featured_image,
 * we pick the first image embedded in the body so the blog listing,
 * social cards, and article header always have something to show.
 *
 * Returns `null` when:
 *   • input is empty / not a string
 *   • no `<img>` tag is found
 *   • the matched src is empty / whitespace
 *
 * Regex approach is fine here — we only need the first match, not a
 * full HTML parse. Handles both single and double quotes.
 */
export function extractFirstImage(html: string | null | undefined): string | null {
  if (!html || typeof html !== 'string') return null

  // Match the src attribute of the first <img> tag.
  // [^>]* allows for other attributes before src (class, alt, etc.)
  const match = html.match(/<img[^>]*\ssrc\s*=\s*["']([^"']+)["']/i)
  if (!match) return null

  const src = match[1].trim()
  if (!src) return null
  return src
}

/**
 * Resolves the "effective" featured image for a post: use the explicit
 * featured_image if set, otherwise fall back to the first image in the
 * content. Returns empty string if neither exists so downstream code can
 * check truthiness.
 */
export function resolveFeaturedImage(
  featuredImage: string | null | undefined,
  content: string | null | undefined,
): string {
  const explicit = (featuredImage || '').trim()
  if (explicit) return explicit
  return extractFirstImage(content) || ''
}
