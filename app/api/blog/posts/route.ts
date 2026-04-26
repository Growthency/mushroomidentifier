import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'
import { resolveFeaturedImage } from '@/lib/content-helpers'

// Prevent Next.js from caching this route — always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  // Use service role key for reliable server-side reads (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // `content` is fetched for the resolveFeaturedImage() fallback below —
  // legacy posts without an explicit featured_image still get a thumbnail
  // by extracting the first inline <img> from the article body.
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, content, category, risk_level, region, is_premium, views, read_time, status, created_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[blog/posts] Supabase error:', error.message)
    return NextResponse.json({ posts: [] })
  }

  // Drop policy / meta posts from the listing — direct URLs still work,
  // they just don't mix in alongside editorial articles.
  // Then map to the Article format expected by the blog client.
  const mapped = (posts ?? [])
    .filter(p => !BLOG_HIDDEN_SLUGS.has(p.slug))
    .map(p => ({
    id: p.id + 1000, // offset to avoid collision with hardcoded IDs
    title: p.title,
    excerpt: p.excerpt || '',
    category: p.category || 'Guide',
    riskLevel: p.risk_level || 'General',
    region: p.region || 'Worldwide',
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Draft',
    readTime: p.read_time ? `${p.read_time} min` : '5 min',
    slug: p.slug,
    image: resolveFeaturedImage(p.featured_image, p.content),
    views: p.views || 0,
    is_premium: p.is_premium || false,
  }))

  return NextResponse.json({ posts: mapped })
}
