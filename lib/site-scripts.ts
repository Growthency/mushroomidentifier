/**
 * Fetch enabled custom scripts from Supabase for injection into the site layout.
 * Used by the root layout (server component) to render admin-managed scripts
 * like Google Analytics, Search Console verification, Meta Pixel, etc.
 *
 * Uses anon key + RLS policy (only enabled rows readable by public).
 * Cached via Next.js fetch cache (revalidated every 60s).
 */

import { cache } from 'react'
import { createCachedClient } from '@/lib/db'

export type ScriptPosition = 'head' | 'body_start' | 'body_end'

export interface SiteScript {
  id: string
  name: string
  code: string
  position: ScriptPosition
  enabled: boolean
  sort_order: number
}

export const getEnabledScripts = cache(async function getEnabledScripts(): Promise<SiteScript[]> {
  try {
    // Use anon client — RLS policy ensures only enabled rows are returned
    const supabase = createCachedClient(['site-scripts'], 60)

    const { data, error } = await supabase
      .from('site_scripts')
      .select('id, name, code, position, enabled, sort_order')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[site-scripts] fetch error:', error.message)
      return []
    }
    return (data ?? []) as SiteScript[]
  } catch (err) {
    // Never throw — layout must render even if scripts table is unreachable
    console.error('[site-scripts] unexpected error:', err)
    return []
  }
})

/** Group scripts by position for targeted rendering. */
export function groupByPosition(scripts: SiteScript[]) {
  return {
    head: scripts.filter((s) => s.position === 'head'),
    bodyStart: scripts.filter((s) => s.position === 'body_start'),
    bodyEnd: scripts.filter((s) => s.position === 'body_end'),
  }
}
