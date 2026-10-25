import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// The Better Auth endpoints the site uses; everything else answers 404.
const ALLOWED = new Set([
  '/sign-in/email',
  '/sign-up/email',
  '/sign-out',
  '/get-session',
  '/change-password',
  '/change-email',
  '/update-user',
])

function allowed(req: NextRequest) {
  const path = new URL(req.url).pathname.replace(/^\/api\/auth/, '').replace(/\/$/, '')
  return ALLOWED.has(path)
}

async function handle(req: NextRequest) {
  if (!allowed(req)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    return await getAuth().handler(req)
  } catch (err: any) {
    console.error('[auth] handler failed:', err?.message || err)
    return NextResponse.json({ message: 'Authentication is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}

export const GET = handle
export const POST = handle
