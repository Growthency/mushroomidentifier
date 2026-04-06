import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const adminSupabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${error}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError && data.user) {
      // Auto-create profile for first-time Google OAuth users
      const { data: existing } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!existing) {
        const fullName = data.user.user_metadata?.full_name
          || data.user.user_metadata?.name
          || ''
        const email = data.user.email || ''

        // Generate referral code
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        let hash = 0
        for (let i = 0; i < data.user.id.length; i++) {
          hash = ((hash << 5) - hash) + data.user.id.charCodeAt(i)
          hash |= 0
        }
        let myCode = ''
        let h = Math.abs(hash)
        for (let i = 0; i < 8; i++) {
          myCode += chars[h % chars.length]
          h = Math.floor(h / chars.length) || (h * 31 + i)
        }

        await adminSupabase.from('profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          credits: 30,
          plan: 'free',
          total_identifications: 0,
          referral_code: myCode,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
