import type { NextRequest } from 'next/server'

/**
 * Shared Bearer-token check for the /api/writerfy/* endpoints.
 *
 * Uses a constant-time compare so an attacker probing the endpoint can't
 * learn anything from response-time differences. Returns `true` when the
 * request carries the correct token, `false` otherwise (including when
 * the env var is unset — which means the feature is deliberately off).
 */
export function checkWriterfyAuth(req: NextRequest): boolean {
  const token = process.env.WRITERFY_API_TOKEN
  if (!token) return false

  const header = req.headers.get('authorization') || ''
  const supplied = header.replace(/^Bearer\s+/i, '').trim()
  if (supplied.length !== token.length) return false

  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= supplied.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return mismatch === 0
}
