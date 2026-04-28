import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlogPageClient from './BlogPageClient'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'

// Revalidate every 60s. Previously this used `force-dynamic` + `revalidate=0`,
// which forced the origin to re-render the page on EVERY request and was the
// dominant contributor to the multi-second TTFB users were seeing as a blank
// gradient. New posts still surface within 60s thanks to CDN edge cache rules
// in next.config.js + revalidatePath('/blog') calls from the admin publish
// API routes.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Mushroom Blog – ID Guides, Safety & Foraging Tips',
  description: 'Expert guides, safety tips, regional foraging insights, and AI-powered mushroom identification knowledge from our mycology experts.',
  alternates: { canonical: 'https://mushroomidentifiers.com/blog' },
  openGraph: {
    type: 'website',
    title: 'Mushroom Blog – ID Guides, Safety & Foraging Tips',
    description: 'Expert guides, safety tips, regional foraging insights, and AI-powered mushroom identification knowledge from our mycology experts.',
    url: 'https://mushroomidentifiers.com/blog',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mushroom Identification Blog – Guides & Safety Tips',
    description: 'Expert guides, safety tips, regional foraging insights from mycology experts.',
  },
}

// Fetch admin-published posts at request time so the count is correct on first paint
async function getDbPosts() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, featured_image, category, risk_level, region, is_premium, views, read_time, status, created_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[blog] Supabase error:', error.message)
      return []
    }

    // Drop policy / meta posts (e.g. Safety Disclaimer, Editorial Policy)
    // from the listing. Their direct URLs still work — they just don't
    // mix in alongside editorial articles here.
    return (posts ?? [])
      .filter(p => !BLOG_HIDDEN_SLUGS.has(p.slug))
      .map(p => {
      // Auto-generate excerpt from content if excerpt is empty
      let excerpt = p.excerpt || ''
      if (!excerpt && p.content) {
        const text = p.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        excerpt = text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, '') + '...' : text
      }
      return {
      id: p.id + 1000,
      title: p.title,
      excerpt,
      category: p.category || 'Guide',
      riskLevel: p.risk_level || 'General',
      region: p.region || 'Worldwide',
      date: p.published_at
        ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Draft',
      readTime: p.read_time ? `${p.read_time} min` : '5 min',
      slug: p.slug,
      image: p.featured_image || '',
      views: p.views || 0,
      is_premium: p.is_premium || false,
    }})
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const dbPosts = await getDbPosts()
  return <BlogPageClient dbPosts={dbPosts} />
}
