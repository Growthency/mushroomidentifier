import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

/**
 * Admin-only "nuke all caches" endpoint.
 *
 * Parallels the W3 Total Cache "Empty all caches" button in WordPress:
 * one click and every stale response, data fetch, and rendered page
 * gets invalidated. Next time a visitor (or our SSR) asks for a
 * route, Next.js regenerates it fresh from the underlying data.
 *
 * What gets cleared:
 *   • revalidatePath('/', 'layout') — nukes the entire route cache
 *     for the public site (every page under the root layout)
 *   • revalidateTag('site-content') — footer / header / CTA content
 *   • revalidateTag('homepage-blocks') — admin-editable homepage blocks
 *   • Explicit re-revalidation of high-traffic paths for belt-and-
 *     suspenders safety (harmless double-invalidation)
 *
 * Not affected (and intentionally so):
 *   • Browser cache — controlled by Cache-Control headers per-request,
 *     not something a server button can flush. Users can hard-refresh
 *     (Ctrl+F5) to clear their own browser cache.
 *   • Vercel edge cache for static assets (/_next/static/*) — these
 *     are immutable & fingerprinted, no invalidation needed.
 *
 * Safe to hammer the button — each revalidate call is idempotent and
 * returns within milliseconds. Next.js does the regeneration lazily
 * on the next request to each path.
 */

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

export async function POST() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cleared: string[] = []

  try {
    // ── 1. Entire route cache (cascades to every page under root layout) ──
    revalidatePath('/', 'layout')
    cleared.push('all pages (layout cascade)')

    // ── 2. Known cache tags ──
    const tags = ['site-content', 'homepage-blocks']
    for (const tag of tags) {
      revalidateTag(tag)
      cleared.push(`tag: ${tag}`)
    }

    // ── 3. Explicit high-traffic paths (safety net) ──
    const paths = [
      '/',
      '/blog',
      '/pricing',
      '/about',
      '/contact',
      '/refund',
      '/terms',
      '/privacy',
      '/sitemap.xml',
      '/feed.xml',
      '/robots.txt',
    ]
    for (const path of paths) {
      revalidatePath(path)
      cleared.push(path)
    }

    return NextResponse.json({
      ok: true,
      message: 'All caches cleared — site regenerating fresh content on next request.',
      cleared: cleared.length,
      details: cleared,
      clearedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Clear cache failed' },
      { status: 500 },
    )
  }
}
