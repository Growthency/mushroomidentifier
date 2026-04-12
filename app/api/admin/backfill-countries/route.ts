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

  // Find users with signup_ip but no country
  const { data: users } = await admin
    .from('profiles')
    .select('id, signup_ip, country')
    .not('signup_ip', 'is', null)
    .or('country.is.null,country.eq.')

  if (!users || users.length === 0) {
    return NextResponse.json({ message: 'No users to backfill', updated: 0 })
  }

  let updated = 0
  const results: { id: string; ip: string; country: string | null }[] = []

  for (const u of users) {
    if (!u.signup_ip) continue
    const country = await getCountryFromIp(u.signup_ip)
    if (country) {
      await admin.from('profiles').update({ country }).eq('id', u.id)
      updated++
    }
    results.push({ id: u.id, ip: u.signup_ip, country })
    // Small delay to avoid rate limiting on ipapi.co
    await new Promise(r => setTimeout(r, 500))
  }

  return NextResponse.json({ message: `Backfilled ${updated} users`, updated, results })
}
