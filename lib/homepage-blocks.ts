/**
 * Server-side fetcher for homepage content blocks.
 * Returns an empty array if the table doesn't exist yet (pre-migration) or
 * on any error — caller falls back to hardcoded homepage content so the
 * site never breaks on a DB hiccup.
 */

import { createClient } from '@supabase/supabase-js'

export type HomepageBlockType =
  | 'heading'
  | 'rich-text'
  | 'image'
  | 'two-column'
  | 'visual-break'
  | 'cta-box'
  | 'feature-grid'

export interface HomepageBlock {
  id: string
  order_index: number
  block_type: HomepageBlockType
  data: Record<string, any>
  visible: boolean
  created_at: string
  updated_at: string
}

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Revalidate frequently so admin edits appear fast on the homepage.
        // The API route calls revalidatePath('/') on writes for instant refresh;
        // this 60s TTL is the fallback for any other surface that reads blocks.
        fetch: (url: any, init: any) =>
          fetch(url, { ...init, next: { revalidate: 60, tags: ['homepage-blocks'] } }),
      },
    }
  )
}

export async function getHomepageBlocks(): Promise<HomepageBlock[]> {
  try {
    const supabase = makeClient()
    const { data, error } = await supabase
      .from('homepage_blocks')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })

    // Table not yet created (fresh DB, before migration runs) — return empty so
    // the homepage falls back to hardcoded content instead of throwing.
    if (error) {
      if (error.message?.includes('Could not find the table')) return []
      console.error('[homepage-blocks] fetch error:', error.message)
      return []
    }
    return (data ?? []) as HomepageBlock[]
  } catch (err) {
    console.error('[homepage-blocks] unexpected error:', err)
    return []
  }
}
