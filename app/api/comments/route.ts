import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const supabase = await createClient()
    const { data: comments, error } = await supabase
      .from('blog_comments')
      .select('id, content, created_at, user_id')
      .eq('article_slug', slug)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!comments?.length) return NextResponse.json({ comments: [] })

    // Fetch profiles separately
    const userIds = [...new Set(comments.map(c => c.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
    const enriched = comments.map(c => ({
      ...c,
      profiles: profileMap[c.user_id] ?? null,
    }))

    return NextResponse.json({ comments: enriched })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { slug, content } = await request.json()
    if (!slug || !content?.trim()) {
      return NextResponse.json({ error: 'slug and content required' }, { status: 400 })
    }

    const { data: inserted, error } = await supabase
      .from('blog_comments')
      .insert({ article_slug: slug, user_id: user.id, content: content.trim() })
      .select('id, content, created_at, user_id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Fetch profile separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()

    return NextResponse.json({ comment: { ...inserted, profiles: profile ?? null } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, content } = await request.json()
    if (!id || !content?.trim()) {
      return NextResponse.json({ error: 'id and content required' }, { status: 400 })
    }

    const { data: updated, error } = await supabase
      .from('blog_comments')
      .update({ content: content.trim() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, content, created_at, user_id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ comment: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ deleted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
