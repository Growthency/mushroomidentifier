import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'
import { AD_PLACEMENTS } from '@/lib/ads'

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

// PUT — update an ad unit
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  if (body.placement !== undefined && !AD_PLACEMENTS.includes(body.placement)) {
    return NextResponse.json({ error: 'Invalid placement' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.code !== undefined) updates.code = body.code
  if (body.width !== undefined) updates.width = body.width
  if (body.height !== undefined) updates.height = body.height
  if (body.placement !== undefined) updates.placement = body.placement
  if (body.paragraph_number !== undefined) updates.paragraph_number = body.paragraph_number
  if (body.max_ads !== undefined) updates.max_ads = body.max_ads
  if (body.sticky !== undefined) updates.sticky = body.sticky
  if (body.page_types !== undefined) updates.page_types = sanitizePageTypes(body.page_types)
  if (body.show_desktop !== undefined) updates.show_desktop = body.show_desktop
  if (body.show_mobile !== undefined) updates.show_mobile = body.show_mobile
  if (body.lazy_load !== undefined) updates.lazy_load = body.lazy_load
  if (body.enabled !== undefined) updates.enabled = body.enabled
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order

  let { data, error } = await admin
    .from('ad_units')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  // DB not migrated yet (sticky/max_ads columns missing) — retry without them
  // so editing other fields keeps working during the deploy→SQL window.
  if (error && /max_ads|sticky/i.test(error.message)) {
    delete updates.max_ads
    delete updates.sticky
    if (Object.keys(updates).length > 0) {
      ;({ data, error } = await admin
        .from('ad_units')
        .update(updates)
        .eq('id', id)
        .select()
        .single())
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ad: data })
}

// DELETE — remove an ad unit
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await admin.from('ad_units').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
