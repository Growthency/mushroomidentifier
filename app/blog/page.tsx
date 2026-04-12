import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog | Mushroom Identifier',
  description: 'Expert guides, safety tips, regional foraging insights, and AI-powered mushroom identification knowledge from our mycology experts.',
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
      .select('id, title, slug, excerpt, featured_image, category, risk_level, region, is_premium, views, read_time, status, created_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[blog] Supabase error:', error.message)
      return []
    }

    return (posts ?? []).map(p => ({
      id: p.id + 1000,
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
      image: p.featured_image || '',
      views: p.views || 0,
      is_premium: p.is_premium || false,
    }))
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const dbPosts = await getDbPosts()
  return <BlogPageClient dbPosts={dbPosts} />
}
