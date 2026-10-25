import { getDb } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

/**
 * Per-request server client: `auth.getUser()` reads the Better Auth session
 * cookie; `.from()` / `.storage` are the PostgreSQL client.
 *
 * There is no row-level security any more — every query on user data must
 * filter by the signed-in user's id (`.eq('user_id', user.id)`).
 */
export async function createClient() {
  const db = getDb()
  return {
    ...db,
    auth: {
      async getUser() {
        const user = await getSessionUser()
        return { data: { user }, error: null }
      },
    },
  }
}
