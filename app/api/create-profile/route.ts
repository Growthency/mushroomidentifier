import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateEmailQuality } from '@/lib/email-validation'

// Service role — bypasses RLS, only used server-side
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

function genCode(uid: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = ((hash << 5) - hash) + uid.charCodeAt(i)
    hash |= 0
  }
  let code = ''
  let h = Math.abs(hash)
  for (let i = 0; i < 8; i++) {
    code += chars[h % chars.length]
    h = Math.floor(h / chars.length) || (h * 31 + i)
  }
  return code
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || null
}

async function getCountryFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const data = await res.json()
    return data.country_name || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName, referralCode, country } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // --- Email quality check ---
    const emailCheck = validateEmailQuality(email)
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.reason }, { status: 400 })
    }

    // Verify the user actually exists in Supabase Auth (prevent fake userId)
    const { data: authUser, error: authErr } = await adminSupabase.auth.admin.getUserById(userId)
    if (authErr || !authUser?.user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    // --- IP-based duplicate account check ---
    const clientIp = getClientIp(request)
    if (clientIp) {
      const { data: existingByIp } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('signup_ip', clientIp)
        .limit(1)
        .maybeSingle()

      if (existingByIp) {
        return NextResponse.json({
          error: 'suspicious_ip',
          message: 'An account already exists from your network. For security reasons, only one account is allowed per network. If you believe this is a mistake, please contact support.',
        }, { status: 409 })
      }
    }

    const myCode = genCode(userId)

    // Insert with HARDCODED safe defaults — client cannot influence plan/credits
    const { error: insertErr } = await adminSupabase.from('profiles').insert({
      id:                   userId,
      email:                email,
      full_name:            fullName || '',
      credits:              30,          // always 30 — never from client
      plan:                 'free',      // always free — never from client
      total_identifications: 0,
      referral_code:        myCode,
      signup_ip:            clientIp,
      country:              country || (clientIp ? await getCountryFromIp(clientIp) : null),
    })

    if (insertErr) throw insertErr

    // Apply referral bonus if a valid ref code was provided
    if (referralCode) {
      const { data: referrer } = await adminSupabase
        .from('profiles')
        .select('id, credits')
        .eq('referral_code', referralCode.toUpperCase())
        .maybeSingle()

      if (referrer && referrer.id !== userId) {
        // New user gets +20 bonus credits
        await adminSupabase
          .from('profiles')
          .update({ credits: 50, referred_by: referrer.id })  // 30 base + 20 bonus
          .eq('id', userId)

        // Referrer gets +20 bonus credits
        await adminSupabase
          .from('profiles')
          .update({ credits: (referrer.credits || 0) + 20 })
          .eq('id', referrer.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('create-profile error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create profile' }, { status: 500 })
  }
}
