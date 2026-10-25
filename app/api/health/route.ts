import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Liveness check for Docker / Coolify (no database round-trip). */
export function GET() {
  return NextResponse.json({ ok: true })
}
