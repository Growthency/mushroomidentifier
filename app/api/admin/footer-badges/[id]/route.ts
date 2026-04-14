import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_LOCATIONS = ['footer_explore', 'footer_company']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { location, image_url, link_url, alt_text, width, height, sort_order, enabled } = body

  if (location && !VALID_LOCATIONS.includes(location)) {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (location !== undefined) updates.location = location
  if (image_url !== undefined) updates.image_url = image_url
  if (link_url !== undefined) updates.link_url = link_url
  if (alt_text !== undefined) updates.alt_text = alt_text
  if (width !== undefined) updates.width = width
  if (height !== undefined) updates.height = height
  if (sort_order !== undefined) updates.sort_order = sort_order
  if (enabled !== undefined) updates.enabled = enabled

  const { data, error } = await admin
    .from('footer_badges')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await admin.from('footer_badges').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
