import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const { referralCode, newUserId } = await request.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Find the referrer by their code
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id, credits, referral_code')
      .eq('referral_code', referralCode.toUpperCase())
      .maybeSingle()

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Don't allow self-referral
    if (referrer.id === newUserId) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 })
    }

    // Check new user isn't already marked as referred
    const { data: newUser } = await supabase
      .from('profiles')
      .select('referred_by, credits')
      .eq('id', newUserId)
      .maybeSingle()

    if (!newUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (newUser.referred_by) {
      return NextResponse.json({ error: 'Referral already applied' }, { status: 409 })
    }

    // Give new user 20 bonus credits + mark as referred
    await supabase
      .from('profiles')
      .update({
        credits: (newUser.credits || 30) + 20,
        referred_by: referrer.id,
      })
      .eq('id', newUserId)

    // Give referrer 20 bonus credits
    await supabase
      .from('profiles')
      .update({ credits: (referrer.credits || 0) + 20 })
      .eq('id', referrer.id)

    return NextResponse.json({ success: true, bonusCredits: 20 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to apply referral', details: error.message }, { status: 500 })
  }
}
