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

// GET — list all settings grouped by group_name
export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin
    .from('site_settings')
    .select('*')
    .order('group_name', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data ?? [] })
}

// PUT — bulk update many settings at once { updates: [{ key, value }, ...] }
export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updates: { key: string; value: string }[] = body.updates || []
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
  }

  // Update each setting by key
  const results = []
  for (const { key, value } of updates) {
    const { error } = await admin.from('site_settings').update({ value }).eq('key', key)
    if (error) results.push({ key, error: error.message })
  }

  const errors = results.filter((r) => r.error)
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 500 })
  return NextResponse.json({ success: true, count: updates.length })
}
