import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { hasDatabase } from '@/lib/db/pool'

/** The signed-in user in the shape the code used from Supabase Auth. */
export type SessionUser = {
  id: string
  email: string
  user_metadata: { full_name?: string; name?: string }
  email_confirmed_at: string | null
  created_at: string
}

export function toSessionUser(u: any): SessionUser | null {
  if (!u?.id) return null
  return {
    id: String(u.id),
    email: String(u.email || ''),
    user_metadata: { full_name: u.name || '', name: u.name || '' },
    email_confirmed_at: u.emailVerified ? new Date(u.updatedAt || u.createdAt || Date.now()).toISOString() : null,
    created_at: new Date(u.createdAt || Date.now()).toISOString(),
  }
}

/**
 * Current user from the Better Auth session cookie, or null.
 * Works in Server Components, Route Handlers and Server Actions.
 */
export async function getSessionUser(reqHeaders?: Headers): Promise<SessionUser | null> {
  // Read the request headers first, even during `next build`: that marks
  // every page that checks the user as dynamic (as the Supabase cookie read
  // did), instead of a static page that breaks at runtime.
  const h = reqHeaders ?? new Headers(Object.fromEntries((await headers()).entries()))
  if (!hasDatabase()) return null
  try {
    const session = await getAuth().api.getSession({ headers: h })
    return toSessionUser(session?.user)
  } catch (err: any) {
    console.error('[auth] session lookup failed:', err?.message || err)
    return null
  }
}
