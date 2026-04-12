import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/* ── GET — fetch view count(s) for slug(s) ── */
export async function GET(request: NextRequest) {
  // Batch mode: ?slugs=/a,/b,/c → { views: { "/a": 10, "/b": 5 } }
  const slugsParam = request.nextUrl.searchParams.get('slugs')
  if (slugsParam) {
    const slugList = slugsParam.split(',').filter(Boolean)
    const { data } = await supabase
      .from('page_views')
      .select('slug, views')
      .in('slug', slugList)
    const map: Record<string, number> = {}
    for (const row of data ?? []) map[row.slug] = row.views || 0
    return NextResponse.json({ views: map })
  }

  // Single mode: ?slug=/a → { views: 10 }
  const slug = request.nextUrl.searchParams.get('slug') || ''
  if (!slug) {
    return NextResponse.json({ views: 0 })
  }

  const { data } = await supabase
    .from('page_views')
    .select('views')
    .eq('slug', slug)
    .single()

  return NextResponse.json({ views: data?.views || 0 })
}

/* ── POST — increment view count for a slug ── */
export async function POST(request: NextRequest) {
  const { slug } = await request.json().catch(() => ({ slug: '' }))
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  // Upsert into page_views — works for ALL pages (species + blog posts)
  const { data: existing } = await supabase
    .from('page_views')
    .select('views')
    .eq('slug', slug)
    .single()

  if (existing) {
    await supabase
      .from('page_views')
      .update({ views: existing.views + 1 })
      .eq('slug', slug)
  } else {
    await supabase
      .from('page_views')
      .insert({ slug, views: 1 })
  }

  // Also update blog_posts.views if this slug exists there (keeps [slug] route in sync)
  const { data: post } = await supabase
    .from('blog_posts')
    .select('views')
    .eq('slug', slug)
    .single()

  if (post) {
    await supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('slug', slug)
  }

  return NextResponse.json({ ok: true })
}
