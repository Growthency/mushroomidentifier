import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Popular posts: top 10 by views
  const { data: popular } = await supabase
    .from('blog_posts')
    .select('title, slug, featured_image, views')
    .eq('status', 'published')
    .order('views', { ascending: false, nullsFirst: false })
    .limit(10)

  // Recent posts: latest 10 by published_at
  const { data: recent } = await supabase
    .from('blog_posts')
    .select('title, slug, featured_image, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(10)

  return NextResponse.json({
    popular: (popular ?? []).map(p => ({
      title: p.title,
      slug: p.slug,
      image: p.featured_image || '',
      views: p.views || 0,
    })),
    recent: (recent ?? []).map(p => ({
      title: p.title,
      slug: p.slug,
      image: p.featured_image || '',
      date: new Date(p.published_at || p.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    })),
  })
}
