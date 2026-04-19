import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { checkWriterfyAuth } from '@/lib/writerfy-auth'

/**
 * GET /api/writerfy/drafts
 *
 * Returns every post currently in draft status. Writerfy's Schedule tab
 * calls this to populate the list the admin picks from.
 *
 * Response shape matches the spec's "preferred" form:
 *   { drafts: [{ id, title, excerpt, slug, createdAt, updatedAt }, ...] }
 *
 * Same Bearer token as the other /api/writerfy/* endpoints.
 */

export const runtime = 'nodejs'

// Don't cache — admin may have just created or deleted drafts.
export const dynamic = 'force-dynamic'

function supabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabase()
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, excerpt, created_at, updated_at')
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const drafts = (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title || '',
    excerpt: row.excerpt || '',
    slug: row.slug || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  return NextResponse.json({ drafts })
}
