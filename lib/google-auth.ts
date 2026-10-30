/**
 * Google service-account access shared by the admin Dashboard (GA4, Search
 * Console) and the Indexing Report.
 *
 * Env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, optional GSC_SITE_URL
 * ("sc-domain:mushroomidentifiers.com" or "https://mushroomidentifiers.com/").
 * Server-only.
 */
import { google } from 'googleapis'

const DOMAIN = 'mushroomidentifiers.com'

/**
 * GOOGLE_PRIVATE_KEY as a clean PEM, however it was pasted: the whole
 * service-account JSON file, with surrounding quotes, with literal "\n" (also
 * double-escaped), or with its line breaks turned into spaces or lost, as some
 * env editors do. A key OpenSSL cannot read fails with
 * "error:1E08010C:DECODER routines::unsupported".
 */
export function normalizePrivateKey(raw: string | undefined): string {
  let key = String(raw || '').trim()
  if (key.startsWith('{')) {
    try {
      key = JSON.parse(key).private_key || key
    } catch {
      /* not JSON after all */
    }
  }
  key = key
    .replace(/^["']|["'],?$/g, '')
    .replace(/\\\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\r/g, '')
  const pem = key.match(/-----BEGIN ([A-Z ]+?)-----([\s\S]*?)-----END \1-----/)
  if (!pem) return key
  const body = pem[2].replace(/[^A-Za-z0-9+/=]/g, '')
  return `-----BEGIN ${pem[1]}-----\n${(body.match(/.{1,64}/g) || []).join('\n')}\n-----END ${pem[1]}-----\n`
}

export function googleAuth(scopes: string[]) {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    },
    scopes,
  })
}

/** What is wrong with GOOGLE_PRIVATE_KEY, without showing any of it. */
function describePrivateKey(): string {
  const raw = String(process.env.GOOGLE_PRIVATE_KEY || '')
  const key = normalizePrivateKey(raw)
  if (!raw.trim()) return 'GOOGLE_PRIVATE_KEY is empty'
  if (!/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(key)) {
    return `GOOGLE_PRIVATE_KEY has no "-----BEGIN PRIVATE KEY-----" line (${raw.length} characters)`
  }
  if (!/-----END [A-Z ]*PRIVATE KEY-----/.test(key)) {
    return `GOOGLE_PRIVATE_KEY is cut off: no "-----END PRIVATE KEY-----" line (${raw.length} characters)`
  }
  const body = key.replace(/-----[A-Z ]+-----/g, '').replace(/\s/g, '')
  return `GOOGLE_PRIVATE_KEY looks damaged (${body.length} key characters; a Google key has about 1620). Paste the "private_key" value from the service-account JSON file again`
}

/** Readable, secret-free message from a googleapis / OpenSSL error. */
export function googleErrorMessage(err: any): string {
  const apiMsg = err?.response?.data?.error?.message || err?.errors?.[0]?.message
  let msg = String(apiMsg || err?.message || err)
  if (!apiMsg && /DECODER|PEM|asn1|private key/i.test(msg)) msg = `${describePrivateKey()} (${msg})`
  return msg.length > 300 ? `${msg.slice(0, 300)}…` : msg
}

let cachedProperty: string | null = null

/**
 * The Search Console property to query: GSC_SITE_URL when set, otherwise
 * whichever property of this domain the service account can see (a Domain
 * property and a URL-prefix property use different ids; the wrong one answers
 * "User does not have sufficient permission").
 */
export async function searchConsoleProperty(): Promise<string> {
  const env = (process.env.GSC_SITE_URL || '').trim()
  if (env) {
    if (env.startsWith('sc-domain:')) return env
    return env.endsWith('/') ? env : `${env}/`
  }
  if (cachedProperty) return cachedProperty

  const auth = googleAuth(['https://www.googleapis.com/auth/webmasters.readonly'])
  const res = await google.searchconsole({ version: 'v1', auth }).sites.list()
  const sites = (res.data.siteEntry || []).map((s) => s.siteUrl || '')
  const match =
    sites.find((s) => s === `sc-domain:${DOMAIN}`) ||
    sites.find((s) => s === `https://${DOMAIN}/`) ||
    sites.find((s) => s.includes(DOMAIN))
  if (!match) {
    throw new Error(
      `${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL} has no access to ${DOMAIN} in Search Console. Add it as a user (Owner for indexing requests) of the property.`
    )
  }
  cachedProperty = match
  return match
}
