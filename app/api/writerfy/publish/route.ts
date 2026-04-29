import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { checkWriterfyAuth } from '@/lib/writerfy-auth'
import { resolveFeaturedImage, dedupeProductHeadings } from '@/lib/content-helpers'

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
 * Resolve an enum value sent by Writerfy back to its canonical display
 * form. Writerfy's UI sends the SLUG (e.g. `safety`, `species-guide`)
 * because the categories endpoint exposes both `name` and `slug` and the
 * desktop app uses `slug ?? id` as the option value. We accept the
 * display name, the slug, or any case-insensitive whitespace-insensitive
 * variant — anything that doesn't resolve falls back to the caller's
 * default so the column never gets a bogus string.
 */
function resolveEnumValue(input: unknown, allowed: Set<string>): string | undefined {
  if (typeof input !== 'string') return undefined
  const raw = input.trim()
  if (!raw) return undefined
  if (allowed.has(raw)) return raw
  const norm = raw
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  for (const v of Array.from(allowed)) {
    const slug = v
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    if (slug === norm) return v
  }
  return undefined
}

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

/* ── GET — health check ───────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
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
  if (!checkWriterfyAuth(req)) {
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

  // Sanitise — defense-in-depth. The endpoint is Bearer-token authenticated
  // so the input is already trusted, but stripping <script>/<style> and
  // javascript: URLs is cheap insurance if the token ever leaks.
  //
  // `allowedTags: false` + `allowedAttributes: false` means "allow every
  // HTML tag and attribute" — matching the freedom of the admin RichEditor
  // (tables, iframes, inline styles, class names, data-*, etc.). The
  // library still strips <script>/<style> unconditionally regardless of
  // this setting, so XSS via tag injection is blocked.
  const sanitizedHtml = sanitizeHtml(rawHtml, {
    allowedTags: false as any,
    allowedAttributes: false as any,
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    // Also block javascript: URLs anywhere they can appear.
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite', 'action', 'poster'],
    allowProtocolRelative: true,
  })

  // Dedupe Writerfy product-heading duplicates at storage time so the
  // admin RichEditor, the public article, social previews, and search
  // indexers all see the same clean HTML. The render-side helper in
  // app/[slug]/page.tsx is a safety net for posts that already shipped.
  const htmlContent = dedupeProductHeadings(sanitizedHtml)

  // ── Derive fields ────────────────────────────────────────────────
  const rawSlug = (body.slug as string | undefined)?.trim()
  const slug = rawSlug
    ? (rawSlug.startsWith('/') ? rawSlug : '/' + rawSlug.replace(/^\/+/, ''))
    : slugify(body.title)

  const text = plainText(htmlContent)
  const excerpt = truncate(body.excerpt?.trim() || autoExcerpt(text), 500)
  const words = text.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.round(words / 200)) + ' min read'

  const category = resolveEnumValue(body.category, CATEGORIES) ?? 'Guide'
  const riskLevel = resolveEnumValue(body.risk_level, RISK_LEVELS) ?? 'General'
  const region = resolveEnumValue(body.region, REGIONS) ?? 'Worldwide'
  const status: 'draft' | 'published' =
    body.status === 'published' ? 'published' : 'draft'

  const metaTitle = truncate(body.meta_title?.trim() || body.title, 60)
  const metaDescription = truncate(body.meta_description?.trim() || excerpt, 160)

  // Featured image: if Writerfy explicitly sent one, use it. Otherwise
  // pick the first <img> from the converted HTML body so blog list cards
  // and social previews always have an image.
  const featuredImage = resolveFeaturedImage(body.featured_image, htmlContent)

  const row = {
    title: body.title,
    slug,
    excerpt,
    content: htmlContent,
    featured_image: featuredImage,
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

  // Bust ALL listing surfaces so the new/updated post appears immediately
  // — revalidatePath flushes the Next.js render cache; the new shorter
  // CDN edge cache (60s s-maxage on /blog + /sitemap.xml + /feed.xml,
  // see next.config.js) means visitors see fresh content within ~1 min
  // regardless. The article URL itself is dynamic + always fresh.
  if (saved?.slug) revalidatePath(saved.slug)
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')
  // Homepage is admin-managed blocks (no auto blog list), but call it
  // anyway in case a future homepage block surfaces recent posts.
  revalidatePath('/')

  return NextResponse.json({
    id: saved.id,
    slug: saved.slug,
    url: `https://mushroomidentifiers.com${saved.slug}`,
    status: saved.status,
    updated: !!existing,
  })
}
