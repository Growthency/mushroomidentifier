import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { createClient as createAdmin } from '@supabase/supabase-js'

async function getAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET — list all posts (admin sees all including drafts)
export async function GET(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)

  // Single post by ID
  const id = url.searchParams.get('id')
  if (id) {
    const { data: post, error } = await admin
      .from('blog_posts')
      .select('*')
      .eq('id', Number(id))
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(post)
  }

  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = 25
  const offset = (page - 1) * limit

  const { data: posts, count } = await admin
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({
    posts: posts ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}

// POST — create new post
export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    title, slug, excerpt, content, featured_image,
    category, risk_level, region, is_premium, status,
    author_name, author_role,
  } = body

  if (!title || !slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
  }

  const { data, error } = await admin
    .from('blog_posts')
    .insert({
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      excerpt: excerpt || '',
      content: content || '',
      featured_image: featured_image || '',
      category: category || 'Species Guide',
      risk_level: risk_level || 'General',
      region: region || 'Worldwide',
      is_premium: is_premium ?? false,
      status: status || 'draft',
      author_name: author_name || 'Paul Stamets',
      author_role: author_role || 'Mycologist · Author · Fungi Expert',
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Bust cache so new post appears on blog listing immediately
  if (data?.slug) revalidatePath(data.slug)
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')

  return NextResponse.json(data)
}

// PATCH — update post
export async function PATCH(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

  // If publishing for first time, set published_at
  if (updates.status === 'published') {
    updates.published_at = updates.published_at || new Date().toISOString()
  }
  updates.updated_at = new Date().toISOString()

  const { data, error } = await admin
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Bust cache so changes appear immediately
  if (data?.slug) revalidatePath(data.slug)
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')

  return NextResponse.json(data)
}

// DELETE — delete post
export async function DELETE(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

  // Get slug before deleting so we can bust the cache
  const { data: post } = await admin
    .from('blog_posts')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await admin.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Bust cached pages so deleted post returns 404 immediately
  if (post?.slug) revalidatePath(post.slug)
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')

  return NextResponse.json({ success: true })
}
