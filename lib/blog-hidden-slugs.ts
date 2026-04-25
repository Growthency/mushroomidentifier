/**
 * Slugs that should NOT appear on any blog-listing surface but stay
 * fully accessible at their direct URL (and indexed by Google via the
 * sitemap). Useful for meta / policy / disclaimer pages that we still
 * want crawlable but don't want mixed in with editorial content.
 *
 * To hide more posts: add the slug here (with leading '/') and ship.
 * Removing a post entirely: just delete it from the admin instead.
 */
export const BLOG_HIDDEN_SLUGS: ReadonlySet<string> = new Set([
  '/safety-disclaimer',
  '/editorial-policy',
])

/** Convenience helper — true if the post's slug is in the hidden set. */
export function isHiddenFromBlog(slug: string | null | undefined): boolean {
  if (!slug) return false
  return BLOG_HIDDEN_SLUGS.has(slug)
}
