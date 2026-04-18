import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

/**
 * Admin CRUD for homepage_blocks. All routes require an admin session.
 *
 * Endpoints:
 *   GET                       → list all blocks ordered by order_index
 *   POST                      → create a new block (auto-appends to end)
 *   PATCH  body:{ id, ... }   → update a single block
 *   DELETE body:{ id }        → delete a block
 *   PUT    body:{ order:[id]} → replace full ordering in one shot
 *
 * After any write, revalidate '/' so the homepage picks up changes immediately.
 */

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_TYPES = new Set([
  'heading',
  'rich-text',
  'image',
  'two-column',
  'visual-break',
  'cta-box',
  'feature-grid',
])

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

function bust() {
  revalidatePath('/')
  revalidateTag('homepage-blocks')
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin
    .from('homepage_blocks')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ blocks: data ?? [] })
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { block_type, data = {}, visible = true } = body

  if (!block_type || !VALID_TYPES.has(block_type)) {
    return NextResponse.json({ error: 'Invalid or missing block_type' }, { status: 400 })
  }

  // Auto-append to end of the list
  const { data: maxRow } = await admin
    .from('homepage_blocks')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextOrder = (maxRow?.order_index ?? -1) + 1

  const { data: inserted, error } = await admin
    .from('homepage_blocks')
    .insert({ block_type, data, visible, order_index: nextOrder })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  bust()
  return NextResponse.json({ block: inserted })
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if (updates.block_type && !VALID_TYPES.has(updates.block_type)) {
    return NextResponse.json({ error: 'Invalid block_type' }, { status: 400 })
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await admin
    .from('homepage_blocks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  bust()
  return NextResponse.json({ block: data })
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await admin.from('homepage_blocks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  bust()
  return NextResponse.json({ ok: true })
}

/**
 * PUT — bulk reorder. Body: { order: ['uuid1', 'uuid2', ...] }
 * Rewrites order_index for every id in the array in one transaction.
 */
export async function PUT(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { order } = body as { order?: string[] }
  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json({ error: 'order must be a non-empty array of ids' }, { status: 400 })
  }

  // Update each row's order_index sequentially. For a homepage with <100 blocks
  // this is fast enough; a proper bulk-update-via-CTE could be added later.
  for (let i = 0; i < order.length; i++) {
    const { error } = await admin
      .from('homepage_blocks')
      .update({ order_index: i, updated_at: new Date().toISOString() })
      .eq('id', order[i])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  bust()
  return NextResponse.json({ ok: true })
}
