import { NextRequest, NextResponse } from 'next/server'
import { Paddle, EventName } from '@paddle/paddle-node-sdk'
import { createClient } from '@supabase/supabase-js'

/**
 * Paddle webhook handler — subscription mode.
 *
 * The site runs on monthly auto-renewing subscriptions (Starter / Explorer
 * / Pro). Credits REFRESH (don't stack) at each renewal — plan allowance
 * is set as the new balance every month.
 *
 * Events handled:
 *   subscription.created       → new subscriber, link profile to subscription
 *   subscription.updated       → scheduled cancel, plan change, etc.
 *   subscription.canceled      → Netflix-style: preserve access until
 *                                 current_period_end, then zero credits
 *   subscription.past_due      → payment retry in progress; grace period
 *   transaction.completed      → initial + monthly renewal payments;
 *                                 refresh credits to plan allowance
 *
 * Idempotency: transactions.paddle_transaction_id has a unique index so
 * Paddle retries can't double-credit.
 */

const paddle = new Paddle(process.env.PADDLE_API_KEY!)

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Pack allowances — credits granted per month for each plan.
// Using plan name as key (stored on profiles.plan), not price_id, so
// Paddle price changes don't break this mapping.
const PLAN_CREDITS: Record<string, number> = {
  starter:  120,
  explorer: 550,
  pro:      1200,
}

// Trial abuse prevention — during the 7-day free trial a customer gets
// only 30% of their plan's monthly allowance to evaluate the service.
// This stops users from signing up, burning through a full month of
// identifications for free, then cancelling before the first charge.
//
//   Starter  120 × 0.30 = 36  credits (3 IDs)
//   Explorer 550 × 0.30 = 165 credits (16 IDs)
//   Pro      1200× 0.30 = 360 credits (36 IDs)
//
// On first paid charge (transaction.completed fires after trial ends),
// credits refresh to the full monthly allowance — user is unblocked
// automatically the moment they become a paying customer.
const TRIAL_CREDIT_PERCENT = 0.30

// Reverse map: Paddle price id → internal plan name. Sourced from the same
// env vars the pricing page uses (NEXT_PUBLIC_*) so there's one source of
// truth.
function priceIdToPlan(priceId: string | null | undefined): string | null {
  if (!priceId) return null
  const map: Record<string, string> = {
    [process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID  ?? '']: 'starter',
    [process.env.NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID ?? '']: 'explorer',
    [process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID      ?? '']: 'pro',
  }
  // Guard against '' key from missing env var
  if (!(priceId in map)) return null
  return map[priceId]
}

export async function POST(request: NextRequest) {
  const rawBody  = await request.text()
  const signature = request.headers.get('paddle-signature') ?? ''

  // ── 1. Verify signature ──────────────────────────────────────────
  let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature,
    )
  } catch (err) {
    console.error('[paddle-webhook] signature invalid:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ── 2. Route by event type ───────────────────────────────────────
  try {
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
        await handleSubscriptionCreated(event.data as any)
        break
      case EventName.SubscriptionUpdated:
        await handleSubscriptionUpdated(event.data as any)
        break
      case EventName.SubscriptionCanceled:
        await handleSubscriptionCanceled(event.data as any)
        break
      case EventName.SubscriptionPastDue:
        await handleSubscriptionPastDue(event.data as any)
        break
      case EventName.TransactionCompleted:
        await handleTransactionCompleted(event.data as any)
        break
      default:
        // Log unhandled events for visibility but don't fail the webhook —
        // Paddle retries failed deliveries aggressively.
        console.log('[paddle-webhook] unhandled event:', event.eventType)
    }
  } catch (err: any) {
    console.error(`[paddle-webhook] handler error for ${event.eventType}:`, err)
    // 500 so Paddle retries — better than silently losing a credit event
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/* ── subscription.created ────────────────────────────────────────── */
async function handleSubscriptionCreated(sub: any) {
  // Extract from payload
  const subscriptionId = sub.id as string
  const customerId     = sub.customerId as string | undefined
  const status         = sub.status as string  // 'active'|'trialing'|...
  const periodEnd      = sub.currentBillingPeriod?.endsAt as string | undefined
  const priceId        = sub.items?.[0]?.price?.id as string | undefined
  const customData     = sub.customData as { userId?: string; packId?: string } | null

  const plan = priceIdToPlan(priceId)
  const userId = customData?.userId

  if (!userId) {
    console.error('[paddle-webhook] subscription.created missing userId in customData. sub:', subscriptionId)
    return
  }
  if (!plan) {
    console.error('[paddle-webhook] subscription.created unknown priceId:', priceId)
    return
  }

  // Grant credits RIGHT NOW so trial users can actually use the service.
  // During the 7-day trial: cap at 30% of plan allowance (anti-abuse).
  // On day 8 when transaction.completed fires, credits refresh to the
  // full monthly allowance — paying customers get unblocked automatically.
  //
  // If the subscription was created WITHOUT a trial (status='active' from
  // the start), grant the full allowance now. transaction.completed will
  // arrive moments later and refresh again — idempotent, no harm.
  const isTrialing = status === 'trialing'
  const fullAllowance  = PLAN_CREDITS[plan]
  const trialAllowance = Math.floor(fullAllowance * TRIAL_CREDIT_PERCENT)
  const creditsToGrant = isTrialing ? trialAllowance : fullAllowance

  const { error } = await adminSupabase
    .from('profiles')
    .update({
      subscription_id:            subscriptionId,
      subscription_status:        status,
      current_period_end:         periodEnd,
      paddle_customer_id:         customerId,
      plan,
      credits:                    creditsToGrant,
      subscription_canceled_at:   null,   // reset in case this is a re-subscribe
    })
    .eq('id', userId)

  if (error) {
    console.error('[paddle-webhook] subscription.created update failed:', error)
    throw error
  }
  console.log(
    `[paddle-webhook] subscription.created → user ${userId} plan=${plan} ` +
    `credits=${creditsToGrant} (${isTrialing ? 'TRIAL 30%' : 'full'}) sub=${subscriptionId}`
  )
}

/* ── subscription.updated ────────────────────────────────────────── */
async function handleSubscriptionUpdated(sub: any) {
  const subscriptionId = sub.id as string
  const status         = sub.status as string
  const periodEnd      = sub.currentBillingPeriod?.endsAt as string | undefined
  const priceId        = sub.items?.[0]?.price?.id as string | undefined
  const scheduledChange = sub.scheduledChange // { action, effectiveAt } | null

  const plan = priceIdToPlan(priceId)

  // Look up the profile that owns this subscription
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .maybeSingle()

  if (!profile) {
    console.warn('[paddle-webhook] subscription.updated no profile found for sub:', subscriptionId)
    return
  }

  const patch: Record<string, any> = {
    subscription_status: status,
    current_period_end:  periodEnd,
  }
  if (plan) patch.plan = plan
  // Scheduled cancel (Netflix model): mark canceled_at but keep access active
  if (scheduledChange?.action === 'cancel') {
    patch.subscription_canceled_at = new Date().toISOString()
  }

  const { error } = await adminSupabase.from('profiles').update(patch).eq('id', profile.id)
  if (error) throw error
  console.log(`[paddle-webhook] subscription.updated → user ${profile.id} status=${status}`)
}

/* ── subscription.canceled ───────────────────────────────────────── */
async function handleSubscriptionCanceled(sub: any) {
  const subscriptionId = sub.id as string
  const periodEnd      = sub.currentBillingPeriod?.endsAt as string | undefined

  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, current_period_end')
    .eq('subscription_id', subscriptionId)
    .maybeSingle()

  if (!profile) {
    console.warn('[paddle-webhook] subscription.canceled no profile found for sub:', subscriptionId)
    return
  }

  const effectivePeriodEnd = periodEnd || profile.current_period_end
  const nowPastEnd = effectivePeriodEnd ? new Date(effectivePeriodEnd) <= new Date() : false

  if (nowPastEnd) {
    // Period already expired → zero credits, drop plan to free. User can
    // resubscribe any time.
    const { error } = await adminSupabase
      .from('profiles')
      .update({
        subscription_status:      'canceled',
        subscription_canceled_at: new Date().toISOString(),
        plan:                     'free',
        credits:                  0,
      })
      .eq('id', profile.id)
    if (error) throw error
    console.log(`[paddle-webhook] subscription.canceled (expired) → user ${profile.id}, credits zeroed`)
  } else {
    // Scheduled cancel — user keeps access until period_end
    const { error } = await adminSupabase
      .from('profiles')
      .update({
        subscription_status:      'canceled',
        subscription_canceled_at: new Date().toISOString(),
        current_period_end:       effectivePeriodEnd,
      })
      .eq('id', profile.id)
    if (error) throw error
    console.log(`[paddle-webhook] subscription.canceled (scheduled) → user ${profile.id}, access until ${effectivePeriodEnd}`)
  }
}

/* ── subscription.past_due ───────────────────────────────────────── */
async function handleSubscriptionPastDue(sub: any) {
  // Payment failed, Paddle is retrying. Don't yank credits — grace period.
  const subscriptionId = sub.id as string
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .maybeSingle()
  if (!profile) return

  await adminSupabase
    .from('profiles')
    .update({ subscription_status: 'past_due' })
    .eq('id', profile.id)
  console.log(`[paddle-webhook] subscription.past_due → user ${profile.id} (grace period, credits preserved)`)
}

/* ── transaction.completed ───────────────────────────────────────── */
async function handleTransactionCompleted(tx: any) {
  const txId            = tx.id as string
  const subscriptionId  = tx.subscriptionId as string | undefined
  const priceId         = tx.items?.[0]?.price?.id as string | undefined
  const customData      = tx.customData as { userId?: string; packId?: string } | null
  const totals          = tx.details?.totals
  const amountPaid      = totals?.total ? parseFloat(totals.total) : 0

  // ── Idempotency: skip if we've already processed this transaction ──
  const { data: existing } = await adminSupabase
    .from('transactions')
    .select('id')
    .eq('paddle_transaction_id', txId)
    .maybeSingle()
  if (existing) {
    console.log('[paddle-webhook] transaction.completed already processed:', txId)
    return
  }

  // ── Resolve userId + plan ──
  // For initial subscription payment: customData carries userId, priceId gives plan
  // For renewal: subscriptionId lookup gives userId + stored plan
  let userId: string | null = null
  let plan:   string | null = priceIdToPlan(priceId)

  if (subscriptionId) {
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, plan')
      .eq('subscription_id', subscriptionId)
      .maybeSingle()
    if (profile) {
      userId = profile.id
      if (!plan) plan = profile.plan  // fallback to stored plan for renewals
    }
  }
  if (!userId && customData?.userId) {
    userId = customData.userId
  }

  if (!userId) {
    console.error('[paddle-webhook] transaction.completed could not resolve userId. tx:', txId, 'sub:', subscriptionId)
    return
  }
  if (!plan) {
    console.error('[paddle-webhook] transaction.completed unknown plan for tx:', txId)
    return
  }

  const creditAllowance = PLAN_CREDITS[plan]
  if (!creditAllowance) {
    console.error('[paddle-webhook] transaction.completed unknown plan name:', plan)
    return
  }

  // ── REFRESH credits to allowance (don't add — use-it-or-lose-it model) ──
  const { error: upErr } = await adminSupabase
    .from('profiles')
    .update({
      credits: creditAllowance,
      plan,
      subscription_status: 'active',  // restore in case this renewal recovers from past_due
    })
    .eq('id', userId)
  if (upErr) throw upErr

  // ── Log the transaction ──
  await adminSupabase.from('transactions').insert({
    user_id:                 userId,
    paddle_transaction_id:   txId,
    paddle_subscription_id:  subscriptionId ?? null,
    credits_added:           creditAllowance,  // amount set (not delta) for subscription
    amount_paid:             amountPaid,
    pack_name:               plan,
  })

  console.log(`[paddle-webhook] ✅ credits refreshed to ${creditAllowance} for ${plan} → user ${userId} (tx ${txId})`)
}
