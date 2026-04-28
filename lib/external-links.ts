/**
 * Outbound-link nofollow rules.
 *
 * The admin can register two kinds of rules in /admin/external-links:
 *   • domain  → every <a href> whose hostname matches (or is a subdomain
 *               of) this string gets rel="nofollow" appended.
 *   • url     → only this exact <a href> gets nofollow.
 *
 * applyNofollowRules() runs over a piece of rendered HTML and rewrites
 * every <a> tag in place, preserving any existing rel attribute and
 * deduplicating tokens. Used by the article-page server component before
 * the HTML reaches the browser, so search-engine crawlers see the final
 * `rel="nofollow"` value on first paint.
 */

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

export type NofollowMatchType = 'domain' | 'url'

export interface NofollowRule {
  pattern: string
  match_type: NofollowMatchType
}

const EMPTY: NofollowRule[] = []

/**
 * Fetch the active rule set. Wrapped in React.cache() so a single render
 * tree (RootLayout + page.tsx + nested server components) only pays one
 * round-trip per request, and uses Next.js's fetch cache with a 60s
 * revalidate window + tag so admin writes can flush it explicitly.
 */
export const getNofollowRules = cache(async (): Promise<NofollowRule[]> => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: (url: any, init: any) =>
            fetch(url, { ...init, next: { revalidate: 60, tags: ['nofollow-rules'] } }),
        },
      },
    )

    const { data, error } = await supabase
      .from('external_links_nofollow')
      .select('pattern, match_type')
      .eq('enabled', true)

    if (error) {
      // Table may not exist yet on a fresh deploy — degrade gracefully.
      if (!error.message.includes('Could not find the table')) {
        console.error('[external-links] fetch error:', error.message)
      }
      return EMPTY
    }
    return (data ?? []) as NofollowRule[]
  } catch (err) {
    console.error('[external-links] unexpected error:', err)
    return EMPTY
  }
})

/** Lower-cased hostname extracted from any URL string. Returns '' if the
    string isn't a parseable URL (e.g. mailto:, tel:, or a relative path). */
function safeHostname(href: string): string {
  try {
    return new URL(href).hostname.toLowerCase()
  } catch {
    return ''
  }
}

/** Domain rule normalizer — strip protocol, leading "www.", trailing slash,
    and lowercase. So that "https://www.amazon.com/" and "amazon.com" match
    the same things. */
function normalizeDomain(p: string): string {
  return p
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
}

/** URL rule normalizer — full lowercase, trailing slash collapsed so that
    "https://example.com/foo" matches both "https://example.com/foo" and
    "https://example.com/foo/" in article HTML. */
function normalizeUrl(u: string): string {
  return u.trim().replace(/\/+$/, '').toLowerCase()
}

/** Does `href` match any of the supplied rules? */
function hrefMatchesAnyRule(href: string, rules: NofollowRule[]): boolean {
  if (!rules.length) return false
  const lowerHref = href.toLowerCase()
  const hrefHost = safeHostname(href)

  for (const rule of rules) {
    if (rule.match_type === 'url') {
      if (normalizeUrl(href) === normalizeUrl(rule.pattern)) return true
      continue
    }
    // domain rule
    if (!hrefHost) continue
    const ruleDomain = normalizeDomain(rule.pattern)
    if (!ruleDomain) continue
    if (hrefHost === ruleDomain || hrefHost.endsWith('.' + ruleDomain)) return true
    // Also allow rules pasted without protocol that still appear as a
    // bare path segment in a URL ("example.com/foo") — matched purely
    // by substring as a last-resort heuristic.
    if (lowerHref.includes(ruleDomain)) return true
  }
  return false
}

/** Add a token to a `rel` attribute string, preserving order and avoiding
    duplicates. Returns the new value. */
function addRelToken(existing: string | null, token: string): string {
  const tokens = new Set(
    (existing ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.toLowerCase()),
  )
  tokens.add(token.toLowerCase())
  return Array.from(tokens).join(' ')
}

/**
 * Rewrite every <a href="..."> in `html` so that any href matched by the
 * supplied rules picks up `rel="nofollow"`. Existing rel tokens are
 * preserved (e.g. an Amazon affiliate link that already says
 * `rel="nofollow noopener sponsored"` stays unchanged; one that says
 * `rel="noopener"` gets `noopener nofollow`).
 */
export function applyNofollowRules(html: string, rules: NofollowRule[]): string {
  if (!html || !rules.length) return html

  // Match opening <a ...> tags. We only need to inspect attributes, so we
  // limit to a single tag at a time and rebuild it.
  return html.replace(/<a\s+([^>]*?)>/gi, (full, rawAttrs: string) => {
    const hrefMatch = rawAttrs.match(/href\s*=\s*("([^"]*)"|'([^']*)')/i)
    if (!hrefMatch) return full
    const href = hrefMatch[2] ?? hrefMatch[3] ?? ''
    if (!href) return full
    if (!hrefMatchesAnyRule(href, rules)) return full

    // Extract or stub the existing rel="..." attribute.
    const relMatch = rawAttrs.match(/rel\s*=\s*("([^"]*)"|'([^']*)')/i)
    const existingRel = relMatch ? (relMatch[2] ?? relMatch[3] ?? '') : null
    const newRel = addRelToken(existingRel, 'nofollow')

    let newAttrs: string
    if (relMatch) {
      // Replace the matched rel attribute in-place (keeps surrounding
      // whitespace and other attributes intact).
      newAttrs = rawAttrs.replace(relMatch[0], `rel="${newRel}"`)
    } else {
      // Append a brand-new rel attribute.
      newAttrs = `${rawAttrs.trimEnd()} rel="${newRel}"`
    }
    return `<a ${newAttrs}>`
  })
}
