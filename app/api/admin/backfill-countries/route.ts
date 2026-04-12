import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { createClient as createAdmin } from '@supabase/supabase-js'

async function getCountryFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json()
    return data.country_name || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get ALL profiles to diagnose
  const { data: allUsers, error: fetchErr } = await admin
    .from('profiles')
    .select('id, email, signup_ip, country')

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  // Filter: users with signup_ip but missing country
  const toBackfill = (allUsers ?? []).filter(u => u.signup_ip && !u.country)

  let updated = 0
  const results: { email: string; ip: string | null; country: string | null; status: string }[] = []

  // Show all users' status for diagnostics
  for (const u of allUsers ?? []) {
    if (!u.signup_ip) {
      results.push({ email: u.email, ip: null, country: u.country, status: 'no_ip' })
    } else if (u.country) {
      results.push({ email: u.email, ip: u.signup_ip, country: u.country, status: 'already_has_country' })
    }
  }

  // Backfill users that have IP but no country
  for (const u of toBackfill) {
    const country = await getCountryFromIp(u.signup_ip)
    if (country) {
      await admin.from('profiles').update({ country }).eq('id', u.id)
      updated++
      results.push({ email: u.email, ip: u.signup_ip, country, status: 'backfilled' })
    } else {
      results.push({ email: u.email, ip: u.signup_ip, country: null, status: 'lookup_failed' })
    }
    // Small delay to avoid rate limiting on ipapi.co
    await new Promise(r => setTimeout(r, 500))
  }

  return NextResponse.json({
    totalUsers: allUsers?.length ?? 0,
    usersWithIp: (allUsers ?? []).filter(u => u.signup_ip).length,
    usersWithCountry: (allUsers ?? []).filter(u => u.country).length,
    backfilled: updated,
    results,
  })
}
