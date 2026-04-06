import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const adminSupabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    // Verify the caller is authenticated
    const supabase = createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()
    if (!code || typeof code !== 'string' || code.length !== 8) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    // Only set if not already set (prevent overwriting existing code)
    const { data: existing } = await adminSupabase
      .from('profiles')
      .select('referral_code')
      .eq('id', user.id)
      .maybeSingle()

    if (existing?.referral_code) {
      return NextResponse.json({ success: true, code: existing.referral_code })
    }

    await adminSupabase
      .from('profiles')
      .update({ referral_code: code })
      .eq('id', user.id)

    return NextResponse.json({ success: true, code })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
