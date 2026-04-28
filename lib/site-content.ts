/**
 * Server-side fetching of admin-managed site content:
 *   - site_settings   → all editable text/URL content (logo, brand, CTA, payment, etc.)
 *   - social_links    → social media icons in footer
 *   - payment_methods → payment badges (VISA, PayPal, etc.)
 *   - footer_badges   → partner/feature badges (ShowMeBest, Fazier, etc.)
 *
 * Returns empty/default values on error so the site always renders.
 */

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

export interface SocialLink {
  id: string
  label: string
  href: string
  icon_svg: string
  bg_color: string
  icon_color: string
  sort_order: number
  enabled: boolean
}

export interface PaymentMethod {
  id: string
  label: string
  display_html: string
  bg_color: string
  text_color: string
  sort_order: number
  enabled: boolean
}

export interface FooterBadge {
  id: string
  location: 'footer_explore' | 'footer_company'
  image_url: string
  link_url: string
  alt_text: string | null
  width: number
  height: number | null
  sort_order: number
  enabled: boolean
}

export interface SiteContent {
  settings: Record<string, string>
  socialLinks: SocialLink[]
  paymentMethods: PaymentMethod[]
  footerBadges: {
    footerExplore: FooterBadge[]
    footerCompany: FooterBadge[]
  }
}

const EMPTY_CONTENT: SiteContent = {
  settings: {},
  socialLinks: [],
  paymentMethods: [],
  footerBadges: { footerExplore: [], footerCompany: [] },
}

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url: any, init: any) =>
          fetch(url, { ...init, next: { revalidate: 60, tags: ['site-content'] } }),
      },
    }
  )
}

// Wrap with React's request-scoped cache() so multiple callers within the
// same render tree (e.g. RootLayout AND the homepage Server Component) only
// trigger one round-trip to Supabase per request. Without this, the
// homepage paid the cost of getSiteContent() twice on every cold render.
export const getSiteContent = cache(async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = makeClient()

    const [settingsRes, socialsRes, paymentsRes, badgesRes] = await Promise.all([
      supabase.from('site_settings').select('key, value'),
      supabase.from('social_links').select('*').eq('enabled', true).order('sort_order', { ascending: true }),
      supabase.from('payment_methods').select('*').eq('enabled', true).order('sort_order', { ascending: true }),
      supabase.from('footer_badges').select('*').eq('enabled', true).order('sort_order', { ascending: true }),
    ])

    // Any single failure → degrade gracefully to empty, caller falls back to hardcoded values
    if (settingsRes.error && settingsRes.error.message.includes('Could not find the table')) {
      return EMPTY_CONTENT
    }

    const settings: Record<string, string> = {}
    ;(settingsRes.data ?? []).forEach((row: any) => {
      if (row.value != null) settings[row.key] = row.value
    })

    const badges = (badgesRes.data ?? []) as FooterBadge[]
    return {
      settings,
      socialLinks: (socialsRes.data ?? []) as SocialLink[],
      paymentMethods: (paymentsRes.data ?? []) as PaymentMethod[],
      footerBadges: {
        footerExplore: badges.filter((b) => b.location === 'footer_explore'),
        footerCompany: badges.filter((b) => b.location === 'footer_company'),
      },
    }
  } catch (err) {
    console.error('[site-content] unexpected error:', err)
    return EMPTY_CONTENT
  }
})
