import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

// PUT — update a script
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, code, position, enabled, sort_order } = body

  if (position && !['head', 'body_start', 'body_end'].includes(position)) {
    return NextResponse.json({ error: 'Invalid position' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (code !== undefined) updates.code = code
  if (position !== undefined) updates.position = position
  if (enabled !== undefined) updates.enabled = enabled
  if (sort_order !== undefined) updates.sort_order = sort_order

  const { data, error } = await admin
    .from('site_scripts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ script: data })
}

// DELETE — remove a script
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await admin.from('site_scripts').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
