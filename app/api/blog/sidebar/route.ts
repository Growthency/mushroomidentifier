import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'
import { resolveFeaturedImage } from '@/lib/content-helpers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Popular posts: top 10 by views.
  // Pull `content` too — needed so resolveFeaturedImage() can fall back
  // to the first inline image when an old post has no featured_image set.
  const { data: popular } = await supabase
    .from('blog_posts')
    .select('title, slug, featured_image, content, views')
    .eq('status', 'published')
    .order('views', { ascending: false, nullsFirst: false })
    .limit(10)

  // Recent posts: latest 10 by published_at — same content fallback.
  const { data: recent } = await supabase
    .from('blog_posts')
    .select('title, slug, featured_image, content, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(10)

  // Hide policy / meta posts from both popular + recent rails so they
  // don't pop up as "blog content" alongside species + foraging articles.
  const visiblePopular = (popular ?? []).filter(p => !BLOG_HIDDEN_SLUGS.has(p.slug))
  const visibleRecent  = (recent  ?? []).filter(p => !BLOG_HIDDEN_SLUGS.has(p.slug))

  return NextResponse.json({
    popular: visiblePopular.map(p => ({
      title: p.title,
      slug: p.slug,
      // Use the same fallback logic as the /blog grid: explicit
      // featured_image first, then auto-extract first <img> from content.
      // Old posts saved before the auto-fill rule existed get a useful
      // thumbnail this way without a manual edit.
      image: resolveFeaturedImage(p.featured_image, p.content),
      views: p.views || 0,
    })),
    recent: visibleRecent.map(p => ({
      title: p.title,
      slug: p.slug,
      image: resolveFeaturedImage(p.featured_image, p.content),
      date: new Date(p.published_at || p.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    })),
  })
}
