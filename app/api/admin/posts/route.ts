import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { resolveFeaturedImage } from '@/lib/content-helpers'

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

  // Optional status filter — when set, narrows the paginated list to a
  // single status. Counts always reflect the full DB so the dashboard
  // pills can still show real totals while the user is filtered down.
  const status = url.searchParams.get('status') // 'published' | 'draft' | 'scheduled' | null

  // Build the list query. Filter only when an allowed status is passed.
  let listQuery = admin
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (status === 'published' || status === 'draft' || status === 'scheduled') {
    listQuery = listQuery.eq('status', status)
  }

  // Run paginated list + status counts in parallel — head-only count
  // queries ship no row data and stay cheap.
  const [listRes, publishedRes, draftRes, scheduledRes] = await Promise.all([
    listQuery,
    admin.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    admin.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    admin.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
  ])

  return NextResponse.json({
    posts: listRes.data ?? [],
    total: listRes.count ?? 0,
    publishedCount: publishedRes.count ?? 0,
    draftCount: draftRes.count ?? 0,
    scheduledCount: scheduledRes.count ?? 0,
    page,
    totalPages: Math.ceil((listRes.count ?? 0) / limit),
    status: status ?? 'all',
  })
}

// Auto-generate excerpt from HTML content (strip tags, first ~160 chars)
function autoExcerpt(html: string): string {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= 160) return text
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '...'
}

// POST — create new post
export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    title, slug, excerpt, content, featured_image,
    category, risk_level, region, is_premium, status,
    author_name, author_role, custom_css, custom_schema,
  } = body

  if (!title || !slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
  }

  // If no featured image explicitly set, auto-pick the first <img> in the
  // content so blog list cards, OG images, and article headers always have
  // something to show. Admin can still override later via the edit page.
  const effectiveFeaturedImage = resolveFeaturedImage(featured_image, content)

  const { data, error } = await admin
    .from('blog_posts')
    .insert({
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      excerpt: autoExcerpt(content || ''),
      content: content || '',
      featured_image: effectiveFeaturedImage,
      category: category || 'Species Guide',
      risk_level: risk_level || 'General',
      region: region || 'Worldwide',
      is_premium: is_premium ?? false,
      status: status || 'draft',
      author_name: author_name || 'Paul Stamets',
      author_role: author_role || 'Mycologist · Author · Fungi Expert',
      published_at: status === 'published' ? new Date().toISOString() : null,
      layout: body.layout || 'with-sidebar',
      custom_css: custom_css || null,
      custom_schema: custom_schema || null,
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

  // Auto-generate excerpt from content
  if (updates.content) {
    updates.excerpt = autoExcerpt(updates.content)
  }

  // Auto-fill featured_image from the first <img> in content when the admin
  // left the field empty. Only triggers when featured_image is explicitly
  // being sent as empty AND content has images — preserves the existing
  // value if the admin doesn't touch the field at all.
  if (
    Object.prototype.hasOwnProperty.call(updates, 'featured_image') &&
    !(updates.featured_image && String(updates.featured_image).trim()) &&
    updates.content
  ) {
    updates.featured_image = resolveFeaturedImage('', updates.content)
  }

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
