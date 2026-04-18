import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'
import { HOMEPAGE_SEED_BLOCKS } from '@/lib/homepage-seed'

/**
 * POST /api/admin/homepage-blocks/seed
 *
 * Populates the homepage_blocks table with an editable starting point that
 * mirrors the current hardcoded homepage. Two modes:
 *   mode: 'replace'  (default) → wipes existing blocks, inserts seed
 *   mode: 'append'             → appends seed blocks after existing ones
 *
 * The admin UI only calls this when there are zero existing blocks OR the
 * user explicitly confirmed "replace everything". Idempotent in the sense
 * that re-running with 'replace' gives you the same fresh starting point.
 */

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

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const mode: 'replace' | 'append' = body.mode === 'append' ? 'append' : 'replace'

  // Find the starting order_index
  let startOrder = 0
  if (mode === 'replace') {
    const { error: delErr } = await admin.from('homepage_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  } else {
    const { data: maxRow } = await admin
      .from('homepage_blocks')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle()
    startOrder = (maxRow?.order_index ?? -1) + 1
  }

  // Prepare rows
  const rows = HOMEPAGE_SEED_BLOCKS.map((b, i) => ({
    block_type: b.block_type,
    data: b.data,
    visible: true,
    order_index: startOrder + i,
  }))

  // Bulk insert
  const { error: insErr, data: inserted } = await admin
    .from('homepage_blocks')
    .insert(rows)
    .select()

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

  revalidatePath('/')
  revalidateTag('homepage-blocks')

  return NextResponse.json({
    ok: true,
    mode,
    inserted: inserted?.length ?? 0,
  })
}
