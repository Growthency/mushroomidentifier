import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'
import { ADS_MASTER_KEY } from '@/lib/ads'

/**
 * Adify master switch — one sitewide on/off for every ad unit. Stored in
 * site_settings so individual units keep their own enabled/paused state and
 * come back exactly as they were when ads are switched on again.
 */

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

// GET — { enabled: boolean }
export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin
    .from('site_settings')
    .select('value')
    .eq('key', ADS_MASTER_KEY)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ enabled: data?.value !== 'false' })
}

// PUT — { enabled: boolean }
export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  if (typeof body.enabled !== 'boolean') {
    return NextResponse.json({ error: '"enabled" must be true or false' }, { status: 400 })
  }

  const { error } = await admin.from('site_settings').upsert(
    {
      key: ADS_MASTER_KEY,
      value: body.enabled ? 'true' : 'false',
      type: 'text',
      group_name: 'ads',
      label: 'Ads master switch',
      description: 'Managed from /admin/adify. "false" hides every ad unit sitewide.',
      sort_order: 1,
    },
    { onConflict: 'key' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ enabled: body.enabled })
}
