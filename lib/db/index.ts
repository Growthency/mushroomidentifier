import { unstable_cache } from 'next/cache'
import { getPool, hasDatabase } from './pool'
import { createQueryClient } from './query-builder'
import { storage } from './storage'

export { hasDatabase, getPool }

/**
 * The database client (PostgreSQL via DATABASE_URL) with a supabase-js-like
 * API: db.from('table').select()…, db.storage.from('images').upload()…
 *
 * Server-only. It has full access (no row-level security), so callers must
 * authorise first (admin session, signed-in user + user_id filter, Writerfy
 * token, cron secret). Without a database (e.g. during `next build`) every
 * query resolves to an error result instead of throwing.
 */
export function getDb() {
  return createQueryClient(getPool(), storage)
}

/**
 * Read client whose SELECTs go through Next's data cache for `revalidate`
 * seconds, dropped early by revalidateTag(tag) / revalidatePath(). Use it for
 * public data on pages (menus, site settings, posts) — never for user data.
 */
export function createCachedClient(tags: string[] = [], revalidate = 60) {
  return createQueryClient(getPool(), storage, { tags, revalidate })
}

/** Same as getDb(); the name the route files use for their "admin" client. */
export function createAdminClient(..._legacyArgs: any[]) {
  return getDb()
}

export type Db = ReturnType<typeof getDb>

/**
 * Wrap a public, read-only query in Next's data cache (replaces the
 * `fetch(..., { next: { revalidate, tags } })` the Supabase client used).
 *
 *   export const getMenus = cachedRead(async (db) => { … return rows }, ['menus'], { tags: ['menus'] })
 *
 * - Results are cached for `revalidate` seconds and dropped instantly when
 *   an admin route calls revalidateTag(tag) / revalidatePath() after a write.
 * - `fn` should THROW on a query error, so failures are never cached.
 * - Returns `fallback` (never throws) when there is no database or the
 *   query failed.
 */
export function cachedRead<A extends any[], R>(
  fn: (db: Db, ...args: A) => Promise<R>,
  keyParts: string[],
  { tags = [], revalidate = 60 }: { tags?: string[]; revalidate?: number } = {}
) {
  const cached = unstable_cache(
    async (...args: A) => {
      if (!hasDatabase()) throw new Error('NO_DATABASE')
      return fn(getDb(), ...args)
    },
    keyParts,
    { tags, revalidate }
  )

  return async (...args: A): Promise<R | null> => {
    if (!hasDatabase()) return null
    try {
      return await cached(...args)
    } catch (err: any) {
      if (err?.message !== 'NO_DATABASE') console.error(`[db] ${keyParts.join('/')} failed:`, err?.message || err)
      return null
    }
  }
}
