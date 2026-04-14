import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_LOCATIONS = ['header', 'footer_explore', 'footer_company', 'footer_bottom']
const VALID_TARGETS = ['_self', '_blank']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

// PUT — update a menu item
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { location, label, url, target, sort_order, enabled } = body

  if (location && !VALID_LOCATIONS.includes(location)) {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 })
  }
  if (target && !VALID_TARGETS.includes(target)) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (location !== undefined) updates.location = location
  if (label !== undefined) updates.label = label
  if (url !== undefined) updates.url = url
  if (target !== undefined) updates.target = target
  if (sort_order !== undefined) updates.sort_order = sort_order
  if (enabled !== undefined) updates.enabled = enabled

  const { data, error } = await admin
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

// DELETE — remove a menu item
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await admin.from('menu_items').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
