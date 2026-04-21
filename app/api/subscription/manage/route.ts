import { NextRequest, NextResponse } from 'next/server'
import { Paddle } from '@paddle/paddle-node-sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

/**
 * GET /api/subscription/manage
 *
 * Redirects the signed-in user to their Paddle customer portal — a
 * Paddle-hosted page where they can cancel, upgrade/downgrade, update
 * their payment method, and view invoices.
 *
 * Portal sessions are short-lived URLs Paddle issues per user. We
 * generate one on demand rather than storing a static URL because
 * Paddle's docs recommend treating the portal URL as single-use.
 *
 * Auth: standard Supabase session cookie. User must be signed in AND
 * have a paddle_customer_id on their profile (set when their first
 * subscription.created webhook fires).
 */

export const runtime = 'nodejs'

const paddle = new Paddle(process.env.PADDLE_API_KEY!)

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('paddle_customer_id, subscription_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.paddle_customer_id) {
    return NextResponse.json(
      { error: 'No active subscription found. Subscribe from /pricing to get started.' },
      { status: 404 },
    )
  }

  try {
    const session = await paddle.customerPortalSessions.create(
      profile.paddle_customer_id,
      profile.subscription_id ? [profile.subscription_id] : [],
    )

    // Paddle returns nested URL objects:
    //   urls.general.overview — overview page of the portal
    //   urls.subscriptions[i].cancelSubscription / updateSubscriptionPaymentMethod
    // Default to `general.overview` so the user lands on the top-level page
    // where they can cancel, update card, and view invoices all from one
    // place.
    const url = session?.urls?.general?.overview
    if (!url) {
      console.error('[subscription/manage] portal session missing url:', session)
      return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
    }

    // Accept ?redirect=1 to 302 the user straight to Paddle, or default
    // to returning JSON so client-side code can window.location itself.
    if (req.nextUrl.searchParams.get('redirect') === '1') {
      return NextResponse.redirect(url, { status: 302 })
    }
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('[subscription/manage] paddle error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create portal session' },
      { status: 500 },
    )
  }
}
