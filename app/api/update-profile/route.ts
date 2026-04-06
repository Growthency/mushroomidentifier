import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Service role — used only to write safe fields; NEVER exposes plan/credits changes
const adminSupabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Columns a user is NEVER allowed to change via this route
const PROTECTED = ['plan', 'credits', 'total_identifications', 'referred_by', 'referral_code', 'id', 'email']

export async function POST(request: NextRequest) {
  try {
    // Verify the caller is actually authenticated
    const supabase = createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Strip any protected field the client tries to sneak in
    const safeUpdate: Record<string, any> = {}
    for (const [key, value] of Object.entries(body)) {
      if (!PROTECTED.includes(key)) {
        safeUpdate[key] = value
      }
    }

    // Only allowed: full_name (avatar_url handled by /api/upload-avatar)
    const allowed = ['full_name']
    const filtered: Record<string, any> = {}
    for (const key of allowed) {
      if (key in safeUpdate) filtered[key] = safeUpdate[key]
    }

    if (Object.keys(filtered).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { error } = await adminSupabase
      .from('profiles')
      .update(filtered)
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, updated: filtered })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}
