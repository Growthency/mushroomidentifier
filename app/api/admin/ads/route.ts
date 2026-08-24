import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'
import { AD_PLACEMENTS, detectAdSize } from '@/lib/ads'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

function sanitizePageTypes(input: unknown): string[] {
  const allowed = ['all', 'home', 'article']
  if (!Array.isArray(input)) return ['all']
  const cleaned = input.filter((v): v is string => typeof v === 'string' && allowed.includes(v))
  return cleaned.length ? Array.from(new Set(cleaned)) : ['all']
}

// GET — list every ad unit (admin view)
export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin
    .from('ad_units')
    .select('*')
    .order('placement', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ads: data ?? [] })
}

// POST — create a new ad unit
export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, code } = body
  if (!name || !code) {
    return NextResponse.json({ error: 'Name and code are required' }, { status: 400 })
  }

  const placement = AD_PLACEMENTS.includes(body.placement) ? body.placement : 'content_bottom'

  // Auto-detect size from the pasted snippet unless explicit values were sent.
  const detected = detectAdSize(code)
  const width = Number.isFinite(body.width) && body.width > 0 ? body.width : detected.width
  const height = Number.isFinite(body.height) && body.height > 0 ? body.height : detected.height

  const row = {
    name,
    code,
    width,
    height,
    placement,
    paragraph_number: Number.isFinite(body.paragraph_number) ? body.paragraph_number : 3,
    page_types: sanitizePageTypes(body.page_types),
    show_desktop: body.show_desktop !== false,
    show_mobile: body.show_mobile !== false,
    lazy_load: body.lazy_load !== false,
    enabled: body.enabled !== false,
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  }

  const { data, error } = await admin.from('ad_units').insert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ad: data })
}
