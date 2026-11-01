import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/db'
import { getClientIp, resolveCountry } from '@/lib/geo'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

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

/**
 * Google sign-in ends here (Better Auth has already set the session): the
 * first visit creates the profile, then the user goes on to `next`. Old
 * Supabase links arrive without a session and go to the login page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // Behind the proxy request.url says http://0.0.0.0:3000, not the public site.
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mushroomidentifiers.com').replace(/\/$/, '')
  const nextParam = searchParams.get('next') ?? '/dashboard'
  // Only same-site paths — never an open redirect.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'

  const user = await getSessionUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  const db = createClient()
  const { data: existing } = await db.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!existing) {
    const { error } = await db.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name || '',
      credits: 30,
      plan: 'free',
      total_identifications: 0,
      referral_code: genCode(user.id),
      signup_ip: getClientIp(request),
      country: await resolveCountry(request),
    })
    if (error) console.error('[auth] profile for Google sign-in failed:', error.message)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
