import { NextRequest, NextResponse } from 'next/server'
import { Paddle, EventName } from '@paddle/paddle-node-sdk'
import { createClient } from '@supabase/supabase-js'

// Server-side Paddle client (API key)
const paddle = new Paddle(process.env.PADDLE_API_KEY!)

// Admin Supabase — bypasses RLS
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Credits per pack
const PACK_CREDITS: Record<string, number> = {
  starter:  120,
  explorer: 550,
  pro:      1200,
}

export async function POST(request: NextRequest) {
  const rawBody  = await request.text()
  const signature = request.headers.get('paddle-signature') ?? ''

  // ── 1. Verify Paddle webhook signature ──
  // NOTE: unmarshal() returns a Promise in @paddle/paddle-node-sdk v3.
  // The missing `await` was the reason every transaction silently
  // failed to credit — `event` was a Promise, `event.eventType` was
  // undefined, and the handler fell through with {received: true}
  // without crediting anyone.
  let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    )
  } catch (err) {
    console.error('[paddle-webhook] signature invalid:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ── 2. Only handle transaction.completed ──
  if (event.eventType !== EventName.TransactionCompleted) {
    return NextResponse.json({ received: true })
  }

  const tx = event.data as any
  const customData = tx.customData as { userId?: string; packId?: string } | null

  if (!customData?.userId || !customData?.packId) {
    console.error('[paddle-webhook] missing customData, txId:', tx.id)
    return NextResponse.json({ error: 'Missing customData' }, { status: 400 })
  }

  const { userId, packId } = customData
  const creditsToAdd = PACK_CREDITS[packId]

  if (!creditsToAdd) {
    console.error('[paddle-webhook] unknown packId:', packId)
    return NextResponse.json({ error: 'Unknown pack' }, { status: 400 })
  }

  // ── 3. Idempotency — skip if already processed ──
  const { data: existing } = await adminSupabase
    .from('transactions')
    .select('id')
    .eq('paddle_transaction_id', tx.id)
    .maybeSingle()

  if (existing) {
    console.log('[paddle-webhook] already processed:', tx.id)
    return NextResponse.json({ received: true })
  }

  // ── 4. Credit the user ──
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (!profile) {
    console.error('[paddle-webhook] user not found:', userId)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const newCredits = (profile.credits ?? 0) + creditsToAdd

  const { error: updateErr } = await adminSupabase
    .from('profiles')
    .update({ credits: newCredits })
    .eq('id', userId)

  if (updateErr) {
    console.error('[paddle-webhook] credit update failed:', updateErr)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  // ── 5. Log the transaction ──
  const totals = tx.details?.totals
  const amountPaid = totals?.total ? parseFloat(totals.total) : 0

  await adminSupabase.from('transactions').insert({
    user_id:               userId,
    paddle_transaction_id: tx.id,
    credits_added:         creditsToAdd,
    amount_paid:           amountPaid,
    pack_name:             packId,
  })

  console.log(`[paddle-webhook] ✅ +${creditsToAdd} credits → user ${userId} (tx ${tx.id})`)
  return NextResponse.json({ received: true })
}
