import { createCachedClient } from '@/lib/db'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'

const SHOWN = 12

/**
 * Newest guides, server-rendered above the footer on every page. Google
 * refreshes the old pages far more often than it discovers new ones, and the
 * blog list only prints its first page in the HTML, so new posts sat
 * "discovered, not crawled" for weeks. Now every refreshed page links to them.
 */
export default async function LatestGuides() {
  let posts: { slug: string; title: string }[] = []
  try {
    const { data } = await createCachedClient([], 300)
      .from('blog_posts')
      .select('slug, title, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(SHOWN + BLOG_HIDDEN_SLUGS.size)
    posts = ((data ?? []) as { slug: string; title: string }[]).filter((p) => !BLOG_HIDDEN_SLUGS.has(p.slug)).slice(0, SHOWN)
  } catch (err) {
    console.error('[latest-guides] query failed', err)
  }
  if (!posts.length) return null

  return (
    <nav className="mi-latest" aria-label="Latest guides">
      <div className="mi-latest-in">
        <div className="mi-latest-head">
          <span className="mi-latest-title">Latest identification guides</span>
          <a className="mi-latest-all" href="/mushroom-guides">Browse all guides</a>
        </div>
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <a href={p.slug}>{p.title.replace(/\s*\(.*?\)\s*$/, '')}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
