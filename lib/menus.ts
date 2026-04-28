/**
 * Server-side fetching of admin-managed menu items for header + footer.
 * Gracefully returns empty arrays on error so layout always renders.
 *
 * Locations:
 *  - header          → main Navbar links
 *  - footer_explore  → "Explore" column in Footer
 *  - footer_company  → "Company" column in Footer
 *  - footer_bottom   → Privacy / Terms / Refund row at bottom of Footer
 */

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

export type MenuLocation = 'header' | 'footer_explore' | 'footer_company' | 'footer_bottom'

export interface MenuItem {
  id: string
  location: MenuLocation
  label: string
  url: string
  target: '_self' | '_blank'
  sort_order: number
  enabled: boolean
}

export interface MenuGroups {
  header: MenuItem[]
  footerExplore: MenuItem[]
  footerCompany: MenuItem[]
  footerBottom: MenuItem[]
}

const EMPTY_GROUPS: MenuGroups = {
  header: [],
  footerExplore: [],
  footerCompany: [],
  footerBottom: [],
}

export const getMenus = cache(async function getMenus(): Promise<MenuGroups> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: (url: any, init: any) =>
            fetch(url, { ...init, next: { revalidate: 60, tags: ['menus'] } }),
        },
      }
    )

    const { data, error } = await supabase
      .from('menu_items')
      .select('id, location, label, url, target, sort_order, enabled')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })

    if (error || !data) {
      if (error) console.error('[menus] fetch error:', error.message)
      return EMPTY_GROUPS
    }

    return {
      header:        data.filter((m) => m.location === 'header') as MenuItem[],
      footerExplore: data.filter((m) => m.location === 'footer_explore') as MenuItem[],
      footerCompany: data.filter((m) => m.location === 'footer_company') as MenuItem[],
      footerBottom:  data.filter((m) => m.location === 'footer_bottom') as MenuItem[],
    }
  } catch (err) {
    console.error('[menus] unexpected error:', err)
    return EMPTY_GROUPS
  }
})
