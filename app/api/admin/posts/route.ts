import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/server-client'
import { isAdminEmail } from '@/lib/admin'
import { createAdminClient as createAdmin } from '@/lib/db'
import { resolveFeaturedImage } from '@/lib/content-helpers'
import { google } from 'googleapis'
import { googleAuth, searchConsoleProperty } from '@/lib/google-auth'

// Search Console numbers per page (last 28 days), keyed by pathname, so the
// Pages table can show impressions and CTR next to views. Cached an hour.
type PageGsc = { impressions: number; clicks: number; ctr: number; position: number }
let gscPagesCache: { at: number; map: Map<string, PageGsc> } | null = null

const pathOf = (raw: string) => {
  let p = raw
  try { p = new URL(raw, 'https://mushroomidentifiers.com').pathname || '/' } catch { /* keep */ }
  return p.length > 1 ? p.replace(/\/+$/, '').toLowerCase() : '/'
}

async function gscPageMetrics(): Promise<Map<string, PageGsc>> {
  if (gscPagesCache && Date.now() - gscPagesCache.at < 60 * 60 * 1000) return gscPagesCache.map
  const map = new Map<string, PageGsc>()
  try {
    const auth = googleAuth(['https://www.googleapis.com/auth/webmasters.readonly'])
    const sc = google.searchconsole({ version: 'v1', auth })
    const siteUrl = await searchConsoleProperty()
    const end = new Date(); end.setDate(end.getDate() - 1)
    const start = new Date(end); start.setDate(start.getDate() - 27)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)
    const res = await sc.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: ['page'], type: 'web', rowLimit: 5000 },
    }, { timeout: 12000 })
    for (const row of res.data.rows || []) {
      const key = pathOf(row.keys?.[0] || '')
      const prev = map.get(key)
      const impressions = (row.impressions || 0) + (prev?.impressions || 0)
      const clicks = (row.clicks || 0) + (prev?.clicks || 0)
      map.set(key, {
        impressions,
        clicks,
        ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(1)) : 0,
        position: Number((row.position || 0).toFixed(1)),
      })
    }
    gscPagesCache = { at: Date.now(), map }
  } catch (err: any) {
    console.error('[posts] GSC page metrics failed:', err?.message || err)
  }
  return map
}

async function getAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return createAdmin()
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

  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1)
  // Rows per page: 10 / 25 / 50 / 100, or "all" (capped so a typo cannot
  // ask for millions). Default stays 25.
  const limitParam = url.searchParams.get('limit')
  const limit = limitParam === 'all' ? 10000 : [10, 25, 50, 100].includes(Number(limitParam)) ? Number(limitParam) : 25
  const offset = (page - 1) * limit

  // Optional status filter — when set, narrows the paginated list to a
  // single status. Counts always reflect the full DB so the dashboard
  // pills can still show real totals while the user is filtered down.
  const status = url.searchParams.get('status') // 'published' | 'draft' | 'scheduled' | null

  // Sorting applies to the whole filtered list, then the page is cut out,
  // so "highest views" really is the highest across every page.
  //   sort=date|views|links, dir=asc|desc (default: newest first)
  const sortParam = url.searchParams.get('sort')
  const sort = ['views', 'links', 'impressions', 'ctr'].includes(sortParam || '') ? (sortParam as string) : 'date'
  const desc = url.searchParams.get('dir') !== 'asc'
  const statusOk = status === 'published' || status === 'draft' || status === 'scheduled'

  const gsc = await gscPageMetrics()
  const gscOf = (p: any) => gsc.get(pathOf(p.slug || ''))

  let listQuery
  if (sort === 'links' || sort === 'impressions' || sort === 'ctr') {
    // These values are not DB columns (links live in the HTML, GSC numbers
    // come from Google), so order here: fetch the filtered rows, sort, page.
    let allQuery = admin.from('blog_posts').select('*', { count: 'exact' })
    if (statusOk) allQuery = allQuery.eq('status', status)
    const metric = (p: any) =>
      sort === 'links' ? countInternalLinks(p.content)
        : sort === 'impressions' ? (gscOf(p)?.impressions ?? 0)
          : (gscOf(p)?.ctr ?? 0)
    listQuery = allQuery.then((res: any) => {
      const rows = [...(res.data ?? [])].sort((a: any, b: any) => {
        const d = metric(a) - metric(b)
        return (desc ? -d : d) || Date.parse(b.created_at) - Date.parse(a.created_at)
      })
      return { ...res, data: rows.slice(offset, offset + limit) }
    })
  } else {
    let q = admin
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order(sort === 'views' ? 'views' : 'created_at', { ascending: !desc, nullsFirst: !desc })
      .range(offset, offset + limit - 1)
    if (statusOk) q = q.eq('status', status)
    listQuery = q
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
    posts: (listRes.data ?? []).map((p: any) => ({ ...p, gsc: gscOf(p) ?? null })),
    gscAvailable: gsc.size > 0,
    total: listRes.count ?? 0,
    publishedCount: publishedRes.count ?? 0,
    draftCount: draftRes.count ?? 0,
    scheduledCount: scheduledRes.count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((listRes.count ?? 0) / limit)),
    limit: limitParam === 'all' ? 'all' : limit,
    status: status ?? 'all',
    sort,
    dir: desc ? 'desc' : 'asc',
  })
}

// Links to our own pages inside a post's HTML (same rule as the admin table).
function countInternalLinks(html: string): number {
  if (!html) return 0
  const matches = html.match(/<a\s[^>]*href=["'](\/[^"']*|https?:\/\/mushroomidentifiers\.com[^"']*)["'][^>]*>/gi)
  return matches?.length || 0
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
      author_name: author_name || 'Mushroom Identifiers Editorial Team',
      author_role: author_role || 'Field Guides & Mushroom Safety',
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
