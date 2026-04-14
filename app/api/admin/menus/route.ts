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

// GET — list all menu items (all locations, enabled + disabled, admin view)
export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin
    .from('menu_items')
    .select('*')
    .order('location', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

// POST — create a new menu item
export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { location, label, url, target = '_self', sort_order = 999, enabled = true } = body

  if (!location || !label || !url) {
    return NextResponse.json({ error: 'Location, label, and URL are required' }, { status: 400 })
  }
  if (!VALID_LOCATIONS.includes(location)) {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 })
  }
  if (!VALID_TARGETS.includes(target)) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
  }

  const { data, error } = await admin
    .from('menu_items')
    .insert({ location, label, url, target, sort_order, enabled })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}
