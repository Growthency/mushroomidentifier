import pg from 'pg'

/**
 * Shared PostgreSQL connection pool (DATABASE_URL).
 *
 * Returns null when no database is configured, and during `next build`
 * (the database container is not reachable while Docker builds the image),
 * so callers get an error result instead of hanging or crashing.
 */

// Timestamps come back as ISO strings (like the Supabase API returned them)
// instead of Date objects, and bigint counts as numbers.
const parseTimestamptz = pg.types.getTypeParser(1184)
const parseTimestamp = pg.types.getTypeParser(1114)
const iso = (parse: (v: string) => any) => (v: string) => {
  const d = parse(v)
  return d instanceof Date && !isNaN(d.getTime()) ? d.toISOString() : v
}
pg.types.setTypeParser(1184, iso(parseTimestamptz))
pg.types.setTypeParser(1114, iso(parseTimestamp))
pg.types.setTypeParser(20, (v: string) => (v === null ? null : Number(v)))
// numeric → number (PostgREST returned JSON numbers)
pg.types.setTypeParser(1700, (v: string) => (v === null ? null : Number(v)))
// date stays 'YYYY-MM-DD' (no timezone shifting)
pg.types.setTypeParser(1082, (v: string) => v)

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL && process.env.NEXT_PHASE !== 'phase-production-build'
}

declare global {
  // eslint-disable-next-line no-var
  var __mushroomPgPool: pg.Pool | undefined
}

export function getPool(): pg.Pool | null {
  if (!hasDatabase()) return null
  // Survive dev hot reloads without opening a new pool each time.
  if (!globalThis.__mushroomPgPool) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PG_POOL_MAX || 10),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      query_timeout: 20000,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
    pool.on('error', (err) => console.error('[db] idle client error:', err.message))
    globalThis.__mushroomPgPool = pool
  }
  return globalThis.__mushroomPgPool
}
