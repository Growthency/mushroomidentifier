import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { checkWriterfyAuth } from '@/lib/writerfy-auth'

/**
 * GET /api/writerfy/categories
 *
 * Returns the list of article categories Writerfy can pick from when
 * publishing. Categories are a hardcoded enum on this site (not a
 * standalone table), so this endpoint returns the 8 canonical values
 * plus related enums (risk levels + regions) and a published-post
 * count per category so the Writerfy UI can show usage stats.
 *
 * Same Bearer token as the other /api/writerfy/* endpoints.
 */

export const runtime = 'nodejs'

// Cache the response briefly — this list changes rarely and Writerfy
// may hit this on every "compose article" dialog open.
export const revalidate = 120

const CATEGORIES: string[] = [
  'Species Guide',
  'Safety',
  'Edibility Guide',
  'Guide',
  'Yard Guide',
  'Lawn Guide',
  'Cooking',
  'Foraging',
]
const RISK_LEVELS: string[] = ['General', 'Low Risk', 'High Risk', 'Toxic']
const REGIONS: string[] = [
  'Worldwide',
  'US North America',
  'EU Europe',
  'Temperate',
  'Others',
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function supabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Fetch every published post's category in one query, then count in JS.
  // Cheaper and simpler than 8 separate SELECT COUNT queries; the table
  // is small enough (< few thousand rows) that this is fine.
  const db = supabase()
  const { data, error } = await db
    .from('blog_posts')
    .select('category')
    .eq('status', 'published')

  // If the count query fails we still return the enum list with count=0 so
  // Writerfy isn't blocked on a Supabase hiccup.
  const counts: Record<string, number> = {}
  if (!error && Array.isArray(data)) {
    for (const row of data) {
      const c = (row as any).category
      if (c) counts[c] = (counts[c] || 0) + 1
    }
  }

  const categories = CATEGORIES.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
    count: counts[name] || 0,
  }))

  return NextResponse.json({
    categories,
    // Bonus enums Writerfy's UI can surface the same way if it wants to.
    risk_levels: RISK_LEVELS.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
    })),
    regions: REGIONS.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
    })),
  })
}
