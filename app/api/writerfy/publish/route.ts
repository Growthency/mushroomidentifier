import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Writerfy ingestion endpoint.
 *
 * Token-authenticated POST that lets an external desktop tool (Writerfy)
 * create or update blog posts in the same blog_posts table the admin UI
 * writes to. Bearer token lives in env var WRITERFY_API_TOKEN.
 *
 * Accepts Markdown OR HTML content; converts Markdown → HTML server-side
 * and sanitises the result before persisting.
 *
 * See C:\Users\User\Desktop\writerfy\DEVELOPER_SPEC_MUSHROOMIDENTIFIERS.md
 * for the full spec and expected request/response shapes.
 */

export const runtime = 'nodejs'

// Configure marked for GitHub-Flavored Markdown (tables, fenced code, etc.)
// and synchronous parsing so we don't have to await in the hot path.
marked.setOptions({
  gfm: true,
  breaks: false,
})

const CATEGORIES = new Set([
  'Species Guide', 'Safety', 'Edibility Guide', 'Guide',
  'Yard Guide', 'Lawn Guide', 'Cooking', 'Foraging',
])
const RISK_LEVELS = new Set(['General', 'Low Risk', 'High Risk', 'Toxic'])
const REGIONS = new Set(['Worldwide', 'US North America', 'EU Europe', 'Temperate', 'Others'])

/**
 * Layout: spec uses 'full' | 'sidebar' but the DB stores 'full-page' |
 * 'with-sidebar'. Accept both forms on the way in.
 */
function normaliseLayout(v: unknown): 'with-sidebar' | 'full-page' {
  if (v === 'full' || v === 'full-page') return 'full-page'
  return 'with-sidebar'
}

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return '/' + base
}

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function autoExcerpt(text: string): string {
  if (text.length <= 155) return text
  // Break on whitespace near the 152 mark so we don't cut a word in half.
  const cut = text.slice(0, 152).replace(/\s+\S*$/, '')
  return cut + '…'
}

function truncate(s: string, max: number): string {
  if (!s) return s
  return s.length <= max ? s : s.slice(0, max - 1) + '…'
}

function supabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function checkAuth(req: NextRequest): boolean {
  const token = process.env.WRITERFY_API_TOKEN
  if (!token) return false
  const header = req.headers.get('authorization') || ''
  const supplied = header.replace(/^Bearer\s+/i, '').trim()
  // Constant-time compare — prevents timing attacks on the token.
  if (supplied.length !== token.length) return false
  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= supplied.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return mismatch === 0
}

/* ── GET — health check ───────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    ok: true,
    service: 'writerfy-publish',
    version: 1,
  })
}

/* ── POST — create or update ──────────────────────────────────────── */
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  // Required fields
  if (!body?.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (!body?.content || typeof body.content !== 'string') {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  // ── Content conversion ───────────────────────────────────────────
  const rawHtml =
    body.content_format === 'html'
      ? body.content
      : (marked.parse(body.content, { async: false }) as string)

  // Sanitise — even though this endpoint is authenticated, DOMPurify is
  // defence-in-depth and matches the sanitising that the admin RichEditor
  // relies on for copy-pasted content.
  const htmlContent = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'rel', 'allow', 'allowfullscreen', 'frameborder', 'loading'],
  })

  // ── Derive fields ────────────────────────────────────────────────
  const rawSlug = (body.slug as string | undefined)?.trim()
  const slug = rawSlug
    ? (rawSlug.startsWith('/') ? rawSlug : '/' + rawSlug.replace(/^\/+/, ''))
    : slugify(body.title)

  const text = plainText(htmlContent)
  const excerpt = truncate(body.excerpt?.trim() || autoExcerpt(text), 500)
  const words = text.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.round(words / 200)) + ' min read'

  const category = CATEGORIES.has(body.category) ? body.category : 'Guide'
  const riskLevel = RISK_LEVELS.has(body.risk_level) ? body.risk_level : 'General'
  const region = REGIONS.has(body.region) ? body.region : 'Worldwide'
  const status: 'draft' | 'published' =
    body.status === 'published' ? 'published' : 'draft'

  const metaTitle = truncate(body.meta_title?.trim() || body.title, 60)
  const metaDescription = truncate(body.meta_description?.trim() || excerpt, 160)

  const row = {
    title: body.title,
    slug,
    excerpt,
    content: htmlContent,
    featured_image: body.featured_image || '',
    category,
    risk_level: riskLevel,
    region,
    is_premium: !!body.is_premium,
    read_time: readTime,
    status,
    author_name: body.author_name || 'Paul Stamets',
    author_role: body.author_role || 'Mycologist · Author · Fungi Expert',
    meta_title: metaTitle,
    meta_description: metaDescription,
    layout: normaliseLayout(body.layout),
    custom_css: body.custom_css || null,
    custom_schema: body.custom_schema || null,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }

  const db = supabase()
  const overwrite =
    req.nextUrl.searchParams.get('overwrite') === 'true' || !!body.overwrite

  // ── Dedupe / upsert ──────────────────────────────────────────────
  const { data: existing } = await db
    .from('blog_posts')
    .select('id, slug, status, published_at')
    .eq('slug', slug)
    .maybeSingle()

  let saved: any
  if (existing) {
    if (!overwrite) {
      return NextResponse.json(
        {
          error: 'slug already exists',
          id: existing.id,
          slug: existing.slug,
          hint: 'POST with ?overwrite=true or set { "overwrite": true } to replace.',
        },
        { status: 409 },
      )
    }
    // Preserve original published_at when overwriting an already-published post —
    // republishing shouldn't erase the original publish date.
    const patch = {
      ...row,
      updated_at: new Date().toISOString(),
      published_at:
        status === 'published'
          ? (existing.published_at || row.published_at)
          : null,
    }
    const { data, error } = await db
      .from('blog_posts')
      .update(patch)
      .eq('id', existing.id)
      .select('id, slug, status')
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    saved = data
  } else {
    const { data, error } = await db
      .from('blog_posts')
      .insert(row)
      .select('id, slug, status')
      .single()
    if (error) {
      // Unique-violation race: fall back to reporting the conflict cleanly.
      if ((error as any).code === '23505') {
        return NextResponse.json(
          { error: 'slug already exists (race)', slug },
          { status: 409 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    saved = data
  }

  // Bust caches so the new/updated post appears on the blog immediately.
  if (saved?.slug) revalidatePath(saved.slug)
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')

  return NextResponse.json({
    id: saved.id,
    slug: saved.slug,
    url: `https://mushroomidentifiers.com${saved.slug}`,
    status: saved.status,
    updated: !!existing,
  })
}
