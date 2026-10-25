import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

/**
 * Old Supabase confirmation / OAuth links land here. Sign-in is email +
 * password now (no code to exchange), so send the visitor on: to `next`
 * when they are already signed in, otherwise to the login page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const nextParam = searchParams.get('next') ?? '/dashboard'
  // Only same-site paths — never an open redirect.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'

  const user = await getSessionUser()
  if (user) return NextResponse.redirect(`${origin}${next}`)
  return NextResponse.redirect(`${origin}/login`)
}
