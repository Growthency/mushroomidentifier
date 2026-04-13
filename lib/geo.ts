/**
 * Geolocation helpers — reads country from Vercel's free built-in geolocation
 * headers with ipapi.co as fallback.
 *
 * Vercel sends `x-vercel-ip-country` on every request (ISO 3166-1 alpha-2 code,
 * e.g. "US", "BD", "IN"). Free, instant, no rate limits — vastly more reliable
 * than the ipapi.co free tier (1000 req/day, frequent timeouts).
 *
 * Docs: https://vercel.com/docs/edge-network/headers/request-headers#x-vercel-ip-country
 */

import type { NextRequest } from 'next/server'

/** Convert ISO country code (e.g. "US") to full name (e.g. "United States"). */
function codeToCountryName(code: string): string | null {
  if (!code || code.length !== 2) return null
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' })
    const name = dn.of(code.toUpperCase())
    // Intl.DisplayNames returns the code back when unknown — treat as unresolved
    return name && name !== code.toUpperCase() ? name : null
  } catch {
    return null
  }
}

/** Extract client IP from proxy headers. */
export function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || null
}

/** Fallback: look up country via ipapi.co (1000 req/day free tier). */
async function getCountryFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.country_name || null
  } catch {
    return null
  }
}

/**
 * Resolve user country from a request. Primary source: Vercel's free geolocation
 * header (instant, no API call). Fallback: ipapi.co lookup via client IP.
 *
 * Returns full country name (e.g. "United States") or null.
 */
export async function resolveCountry(request: NextRequest): Promise<string | null> {
  // 1. Try Vercel's built-in geolocation header (free, instant, reliable)
  const vercelCode = request.headers.get('x-vercel-ip-country')
  if (vercelCode) {
    const name = codeToCountryName(vercelCode)
    if (name) return name
  }

  // 2. Fallback to ipapi.co if no Vercel header (local dev, non-Vercel deploys)
  const ip = getClientIp(request)
  if (ip) return getCountryFromIp(ip)

  return null
}
