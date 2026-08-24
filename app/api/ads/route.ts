import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Public endpoint — returns the ENABLED ad units the frontend AdifyProvider
 * needs to render. Ad snippets are public by nature (they end up in the page),
 * so returning `code` here is fine. Only enabled rows are exposed.
 *
 * Kept dynamic so admin changes appear on the next page load. The response is
 * tiny (a handful of rows) and cached briefly at the edge.
 */

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data, error } = await supabase
      .from('ad_units')
      .select(
        'id, name, code, width, height, placement, paragraph_number, page_types, show_desktop, show_mobile, lazy_load, sort_order',
      )
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      // Table may not exist yet (migration not run) — fail soft so the site
      // never breaks just because ads aren't set up.
      console.error('[api/ads] error:', error.message)
      return NextResponse.json({ ads: [] })
    }

    return NextResponse.json(
      { ads: data ?? [] },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } },
    )
  } catch (err: any) {
    console.error('[api/ads] unexpected:', err?.message)
    return NextResponse.json({ ads: [] })
  }
}
