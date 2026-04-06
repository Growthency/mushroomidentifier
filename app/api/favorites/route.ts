import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ slugs: [] })

    const { data } = await supabase
      .from('saved_articles')
      .select('article_slug')
      .eq('user_id', user.id)

    return NextResponse.json({ slugs: data?.map(r => r.article_slug) ?? [] })
  } catch {
    return NextResponse.json({ slugs: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { slug, title, image, excerpt, category } = await request.json()
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const { data: existing } = await supabase
      .from('saved_articles')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_slug', slug)
      .maybeSingle()

    if (existing) {
      await supabase.from('saved_articles').delete().eq('id', existing.id)
      return NextResponse.json({ saved: false })
    } else {
      const { error } = await supabase.from('saved_articles').insert({
        user_id: user.id,
        article_slug: slug,
        article_title: title ?? '',
        article_image: image ?? '',
        article_excerpt: excerpt ?? '',
        article_category: category ?? '',
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ saved: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Request failed' }, { status: 500 })
  }
}
