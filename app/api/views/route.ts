import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  const { slug } = await request.json().catch(() => ({ slug: '' }))
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const { error } = await supabase.rpc('increment_views', { post_slug: slug })

  if (error) {
    // Fallback: manual increment if RPC doesn't exist
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
  }

  return NextResponse.json({ ok: true })
}
