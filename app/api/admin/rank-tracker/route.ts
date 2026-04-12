import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const SERPAPI_KEY = process.env.SERPAPI_KEY
const SITE_DOMAIN = 'mushroomidentifiers.com'

// ── GET: list keywords + account quota ──
export async function GET() {
  const { data: keywords, error } = await supabase
    .from('rank_keywords')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch SerpAPI account info for quota
  let quota = { used: 0, limit: 250, remaining: 250 }
  try {
    const res = await fetch(`https://serpapi.com/account.json?api_key=${SERPAPI_KEY}`)
    const acc = await res.json()
    if (acc.total_searches_left !== undefined) {
      quota.remaining = acc.total_searches_left
      quota.used = (acc.plan_searches_left !== undefined)
        ? acc.searches_per_month - acc.plan_searches_left
        : 250 - acc.total_searches_left
      quota.limit = acc.searches_per_month || 250
    }
  } catch {}

  return NextResponse.json({ keywords: keywords || [], quota })
}

// ── POST: add keyword OR run check ──
export async function POST(req: NextRequest) {
  const body = await req.json()

  // --- Add keyword ---
  if (body.action === 'add') {
    const keyword = (body.keyword || '').trim().toLowerCase()
    if (!keyword || keyword.length < 2) {
      return NextResponse.json({ error: 'Keyword too short' }, { status: 400 })
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from('rank_keywords')
      .select('id')
      .eq('keyword', keyword)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Keyword already exists' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('rank_keywords')
      .insert({ keyword })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ keyword: data })
  }

  // --- Run rank check ---
  if (body.action === 'check') {
    if (!SERPAPI_KEY) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
    }

    const { data: keywords } = await supabase
      .from('rank_keywords')
      .select('*')
      .order('created_at', { ascending: true })

    if (!keywords?.length) {
      return NextResponse.json({ error: 'No keywords to check' }, { status: 400 })
    }

    const results = []

    for (const kw of keywords) {
      try {
        let position: number | null = null
        let rankUrl = ''

        // Search up to 5 pages (50 results) to find our domain
        // Each page uses 1 SerpAPI credit, so we stop as soon as we find a match
        const MAX_PAGES = 10
        for (let page = 0; page < MAX_PAGES; page++) {
          const start = page * 10
          const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(kw.keyword)}&location=United+States&gl=us&hl=en&num=10&start=${start}&api_key=${SERPAPI_KEY}`
          const res = await fetch(serpUrl)
          const data = await res.json()

          if (data.error) {
            if (page === 0) results.push({ id: kw.id, keyword: kw.keyword, error: data.error })
            break
          }

          // Search organic results for our domain
          const organic = data.organic_results || []
          for (const result of organic) {
            const link = (result.link || '').toLowerCase()
            const displayed = (result.displayed_link || '').toLowerCase()
            if (link.includes(SITE_DOMAIN) || displayed.includes(SITE_DOMAIN)) {
              position = result.position
              rankUrl = result.link
              break
            }
          }

          // Also check featured snippets on first page
          if (page === 0 && !position) {
            const featured = data.answer_box || data.knowledge_graph
            if (featured?.link?.toLowerCase().includes(SITE_DOMAIN)) {
              position = 1
              rankUrl = featured.link
            }
          }

          // Found it or no more results — stop paginating
          if (position || organic.length === 0) break
        }

        const prevPosition = kw.position
        const change = (prevPosition && position)
          ? prevPosition - position // positive = improved
          : null

        // Update keyword in DB
        await supabase
          .from('rank_keywords')
          .update({
            prev_position: prevPosition,
            position,
            rank_url: rankUrl || null,
            change,
            checked_at: new Date().toISOString(),
          })
          .eq('id', kw.id)

        results.push({
          id: kw.id,
          keyword: kw.keyword,
          position,
          prev_position: prevPosition,
          change,
          rank_url: rankUrl,
          total_organic: organic.length,
        })
      } catch (err: any) {
        results.push({
          id: kw.id,
          keyword: kw.keyword,
          error: err.message,
        })
      }
    }

    return NextResponse.json({ results, checked: results.length })
  }

  // --- Check single keyword ---
  if (body.action === 'check_single') {
    if (!SERPAPI_KEY) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
    }

    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing keyword id' }, { status: 400 })

    const { data: kw, error: kwErr } = await supabase
      .from('rank_keywords')
      .select('*')
      .eq('id', id)
      .single()

    if (kwErr || !kw) return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })

    try {
      let position: number | null = null
      let rankUrl = ''

      const MAX_PAGES = 10
      for (let page = 0; page < MAX_PAGES; page++) {
        const start = page * 10
        const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(kw.keyword)}&location=United+States&gl=us&hl=en&num=10&start=${start}&api_key=${SERPAPI_KEY}`
        const res = await fetch(serpUrl)
        const data = await res.json()

        if (data.error) {
          return NextResponse.json({ error: data.error }, { status: 500 })
        }

        const organic = data.organic_results || []
        for (const result of organic) {
          const link = (result.link || '').toLowerCase()
          const displayed = (result.displayed_link || '').toLowerCase()
          if (link.includes(SITE_DOMAIN) || displayed.includes(SITE_DOMAIN)) {
            position = result.position
            rankUrl = result.link
            break
          }
        }

        if (page === 0 && !position) {
          const featured = data.answer_box || data.knowledge_graph
          if (featured?.link?.toLowerCase().includes(SITE_DOMAIN)) {
            position = 1
            rankUrl = featured.link
          }
        }

        if (position || organic.length === 0) break
      }

      const prevPosition = kw.position
      const change = (prevPosition && position)
        ? prevPosition - position
        : null

      await supabase
        .from('rank_keywords')
        .update({
          prev_position: prevPosition,
          position,
          rank_url: rankUrl || null,
          change,
          checked_at: new Date().toISOString(),
        })
        .eq('id', kw.id)

      return NextResponse.json({
        result: {
          id: kw.id,
          keyword: kw.keyword,
          position,
          prev_position: prevPosition,
          change,
          rank_url: rankUrl,
        },
      })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // --- Debug: test a single keyword and return raw results ---
  if (body.action === 'debug') {
    const keyword = (body.keyword || '').trim()
    if (!keyword) return NextResponse.json({ error: 'Missing keyword' }, { status: 400 })

    const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(keyword)}&location=United+States&gl=us&hl=en&num=10&api_key=${SERPAPI_KEY}`
    const res = await fetch(serpUrl)
    const data = await res.json()

    // Extract just the info we need for debugging
    const organic = (data.organic_results || []).map((r: any, i: number) => ({
      pos: r.position,
      title: r.title?.slice(0, 60),
      link: r.link,
      displayed: r.displayed_link,
    }))

    return NextResponse.json({
      error: data.error || null,
      search_info: data.search_information,
      total_organic: organic.length,
      top_results: organic.slice(0, 15),
      our_match: organic.find((r: any) => r.link?.includes(SITE_DOMAIN)) || null,
    })
  }

  // --- Update volume ---
  if (body.action === 'update_volume') {
    const { id, volume } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase
      .from('rank_keywords')
      .update({ volume: volume || null })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// ── DELETE: remove keyword ──
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('rank_keywords')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
