/**
 * A small query builder over PostgreSQL that mirrors the subset of the
 * supabase-js / PostgREST API this codebase uses, so data-access code reads
 * the same as before the move off Supabase:
 *
 *   const { data, error, count } = await db
 *     .from('blog_posts')
 *     .select('id, title', { count: 'exact' })
 *     .eq('status', 'published')
 *     .order('published_at', { ascending: false })
 *     .range(0, 24)
 *
 * Supported: select (columns, count 'exact', head), insert, update, upsert
 * (onConflict, ignoreDuplicates), delete, returning via .select(); filters
 * eq, neq, gt, gte, lt, lte, like, ilike, is, in, not, or (PostgREST filter
 * syntax incl. nested and()/or()); order, range, limit, single, maybeSingle.
 * Every value is sent as a bind parameter; identifiers are validated.
 */
import type { Pool } from 'pg'
import { unstable_cache } from 'next/cache'

export type CacheOptions = { tags: string[]; revalidate: number }

/**
 * SELECT through Next's data cache — the same caching the Supabase client got
 * from `fetch(url, { next: { revalidate, tags } })`. Errors are never cached.
 */
function cachedRows(pool: Pool, text: string, params: any[], opts: CacheOptions): Promise<any[]> {
  return unstable_cache(async () => (await pool.query(text, params)).rows, ['pg', text, JSON.stringify(params)], {
    tags: opts.tags,
    revalidate: opts.revalidate,
  })()
}

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/

// Primary keys for upserts without an explicit onConflict.
const PRIMARY_KEYS: Record<string, string> = {
  site_settings: 'key',
  indexing_cache: 'url',
  page_views: 'slug',
  ip_usage: 'ip_address',
  user_credits: 'user_id',
}

export type DbError = { message: string; code?: string; details?: string | null; hint?: string | null }
export type DbResult<T = any> = { data: T; error: DbError | null; count: number | null; status: number }

function ident(name: string): string {
  if (typeof name !== 'string' || !IDENT.test(name)) {
    throw new Error(`Invalid identifier: ${JSON.stringify(name)}`)
  }
  return `"${name}"`
}

function columnList(cols?: string | null): string {
  const raw = (cols ?? '*').trim()
  if (raw === '' || raw === '*') return '*'
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => (c === '*' ? '*' : ident(c)))
    .join(', ')
}

/** JS value → bind parameter (plain objects are stored as JSON, arrays stay arrays). */
function toParam(v: any): any {
  if (v === undefined) return null
  if (v === null || v instanceof Date || Buffer.isBuffer(v)) return v
  if (Array.isArray(v)) return v
  if (typeof v === 'object') return JSON.stringify(v)
  return v
}

/**
 * Value for an insert/update column. json/jsonb columns get JSON text (an
 * array there is a JSON array, not a Postgres array); everything else goes
 * through toParam (arrays stay arrays for text[] / int[] columns).
 */
function columnParam(v: any, type: string | undefined): any {
  if (v === undefined || v === null) return null
  if (type === 'jsonb' || type === 'json') return JSON.stringify(v)
  return toParam(v)
}

// Column data types per table (information_schema), cached for the process.
const typeCache = new Map<string, Promise<Record<string, string>>>()
function columnTypes(pool: Pool, table: string): Promise<Record<string, string>> {
  let p = typeCache.get(table)
  if (!p) {
    p = pool
      .query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
        [table]
      )
      .then((r) => Object.fromEntries(r.rows.map((x: any) => [x.column_name, x.data_type])))
      .catch(() => {
        typeCache.delete(table)
        return {}
      })
    typeCache.set(table, p)
  }
  return p
}

const OPS: Record<string, string> = { eq: '=', neq: '<>', gt: '>', gte: '>=', lt: '<', lte: '<=', like: 'LIKE', ilike: 'ILIKE' }

function dbError(err: any): DbError {
  return {
    message: err?.message || String(err),
    code: err?.code,
    details: err?.detail ?? null,
    hint: err?.hint ?? null,
  }
}

/* ── PostgREST or()/and() filter-string parser ─────────────────────── */

// Split on commas that are not inside parentheses or double quotes.
function splitTopLevel(s: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quoted = false
  let cur = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '"' && s[i - 1] !== '\\') quoted = !quoted
    else if (!quoted && ch === '(') depth++
    else if (!quoted && ch === ')') depth--
    if (ch === ',' && depth === 0 && !quoted) {
      parts.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim()) parts.push(cur)
  return parts.map((p) => p.trim()).filter(Boolean)
}

function unquote(v: string): string {
  const t = v.trim()
  return t.length >= 2 && t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1).replace(/\\"/g, '"') : t
}

function parseCondition(cond: string, params: any[]): string {
  const group = cond.match(/^(not\.)?(and|or)\((.*)\)$/s)
  if (group) {
    const inner = splitTopLevel(group[3]).map((c) => parseCondition(c, params))
    const joined = `(${inner.join(group[2] === 'and' ? ' AND ' : ' OR ')})`
    return group[1] ? `NOT ${joined}` : joined
  }

  const m = cond.match(/^([A-Za-z_][A-Za-z0-9_]*)\.(not\.)?(eq|neq|gt|gte|lt|lte|like|ilike|is|in)\.(.*)$/s)
  if (!m) throw new Error(`Unsupported filter: ${cond}`)
  const [, col, not, op, rawValue] = m
  let sql: string
  if (op === 'is') {
    const v = rawValue.trim().toLowerCase()
    if (!['null', 'true', 'false'].includes(v)) throw new Error(`Unsupported is value: ${rawValue}`)
    sql = `${ident(col)} IS ${v.toUpperCase()}`
  } else if (op === 'in') {
    const list = rawValue.trim().replace(/^\(/, '').replace(/\)$/, '')
    const values = splitTopLevel(list).map(unquote)
    if (!values.length) sql = 'FALSE'
    else {
      const ph = values.map((v) => {
        params.push(v)
        return `$${params.length}`
      })
      sql = `${ident(col)} IN (${ph.join(', ')})`
    }
  } else {
    let value = unquote(rawValue)
    if (op === 'like' || op === 'ilike') value = value.replace(/\*/g, '%')
    params.push(value)
    sql = `${ident(col)} ${OPS[op]} $${params.length}`
  }
  return not ? `NOT (${sql})` : sql
}

/* ── Builder ───────────────────────────────────────────────────────── */

type Filter = (params: any[]) => string

export class QueryBuilder<T = any> implements PromiseLike<DbResult<T>> {
  private op: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select'
  private columns = '*'
  private countMode: string | null = null
  private head = false
  private filters: Filter[] = []
  private orders: string[] = []
  private limitN: number | null = null
  private offsetN: number | null = null
  private returning: string | null = null
  private values: any = null
  private onConflict: string | null = null
  private ignoreDuplicates = false
  private resultMode: 'many' | 'single' | 'maybe' = 'many'
  private _promise: Promise<DbResult<T>> | null = null
  private colTypes: Record<string, string> = {}

  constructor(private pool: Pool | null, private table: string, private cacheOpts: CacheOptions | null = null) {}

  private rows(text: string, params: any[]): Promise<any[]> {
    const pool = this.pool as Pool
    if (this.cacheOpts && this.op === 'select') return cachedRows(pool, text, params, this.cacheOpts)
    return pool.query(text, params).then((r) => r.rows)
  }

  select(columns = '*', opts: { count?: string; head?: boolean } = {}): QueryBuilder<any> {
    if (this.op === 'select') {
      this.columns = columns
      this.countMode = opts.count || null
      this.head = !!opts.head
    } else {
      this.returning = columns || '*'
    }
    return this
  }

  insert(values: any, _opts?: any): QueryBuilder<any> {
    this.op = 'insert'
    this.values = values
    return this
  }

  upsert(values: any, opts: { onConflict?: string; ignoreDuplicates?: boolean } = {}): QueryBuilder<any> {
    this.op = 'upsert'
    this.values = values
    this.onConflict = opts.onConflict || PRIMARY_KEYS[this.table] || 'id'
    this.ignoreDuplicates = !!opts.ignoreDuplicates
    return this
  }

  update(values: any): QueryBuilder<any> {
    this.op = 'update'
    this.values = values
    return this
  }

  delete(): QueryBuilder<any> {
    this.op = 'delete'
    return this
  }

  private _cmp(col: string, op: string, value: any) {
    this.filters.push((params) => {
      params.push(toParam(value))
      return `${ident(col)} ${OPS[op]} $${params.length}`
    })
    return this
  }

  eq(col: string, v: any) { return v === null ? this.is(col, null) : this._cmp(col, 'eq', v) }
  neq(col: string, v: any) { return this._cmp(col, 'neq', v) }
  gt(col: string, v: any) { return this._cmp(col, 'gt', v) }
  gte(col: string, v: any) { return this._cmp(col, 'gte', v) }
  lt(col: string, v: any) { return this._cmp(col, 'lt', v) }
  lte(col: string, v: any) { return this._cmp(col, 'lte', v) }
  like(col: string, v: any) { return this._cmp(col, 'like', v) }
  ilike(col: string, v: any) { return this._cmp(col, 'ilike', v) }

  is(col: string, v: null | boolean) {
    const word = v === null ? 'NULL' : v === true ? 'TRUE' : v === false ? 'FALSE' : null
    if (!word) throw new Error(`Unsupported is() value: ${v}`)
    this.filters.push(() => `${ident(col)} IS ${word}`)
    return this
  }

  in(col: string, values: any[]) {
    const list = Array.isArray(values) ? values : []
    this.filters.push((params) => {
      if (!list.length) return 'FALSE'
      const ph = list.map((v) => {
        params.push(toParam(v))
        return `$${params.length}`
      })
      return `${ident(col)} IN (${ph.join(', ')})`
    })
    return this
  }

  /** .not('country', 'is', null) / .not('status', 'eq', 'draft') */
  not(col: string, op: string, value: any) {
    this.filters.push((params) => {
      if (op === 'is') {
        const word = value === null ? 'NULL' : value === true ? 'TRUE' : value === false ? 'FALSE' : null
        if (!word) throw new Error(`Unsupported not.is value: ${value}`)
        return `${ident(col)} IS NOT ${word}`
      }
      if (!OPS[op]) throw new Error(`Unsupported not() operator: ${op}`)
      params.push(toParam(value))
      return `NOT (${ident(col)} ${OPS[op]} $${params.length})`
    })
    return this
  }

  or(filterString: string) {
    this.filters.push((params) => {
      const parts = splitTopLevel(filterString).map((c) => parseCondition(c, params))
      return parts.length ? `(${parts.join(' OR ')})` : 'TRUE'
    })
    return this
  }

  order(col: string, opts: { ascending?: boolean; nullsFirst?: boolean } = {}) {
    const dir = opts.ascending === false ? 'DESC' : 'ASC'
    const nulls = opts.nullsFirst === true ? ' NULLS FIRST' : opts.nullsFirst === false ? ' NULLS LAST' : ''
    this.orders.push(`${ident(col)} ${dir}${nulls}`)
    return this
  }

  limit(n: number) {
    this.limitN = Number(n)
    return this
  }

  range(from: number, to: number) {
    this.offsetN = Number(from)
    this.limitN = Number(to) - Number(from) + 1
    return this
  }

  single() {
    this.resultMode = 'single'
    return this
  }

  maybeSingle() {
    this.resultMode = 'maybe'
    return this
  }

  private _where(params: any[]): string {
    if (!this.filters.length) return ''
    return ' WHERE ' + this.filters.map((f) => f(params)).join(' AND ')
  }

  private _rows(): any[] {
    const rows = Array.isArray(this.values) ? this.values : [this.values]
    return rows.filter((r) => r && typeof r === 'object')
  }

  private _build() {
    const params: any[] = []
    const table = ident(this.table)
    const returning = this.returning ? ` RETURNING ${columnList(this.returning)}` : ''

    if (this.op === 'select') {
      const where = this._where(params)
      let text = `SELECT ${columnList(this.columns)} FROM ${table}${where}`
      if (this.orders.length) text += ` ORDER BY ${this.orders.join(', ')}`
      if (this.limitN != null) text += ` LIMIT ${Math.max(0, this.limitN | 0)}`
      if (this.offsetN != null) text += ` OFFSET ${Math.max(0, this.offsetN | 0)}`
      const countParams: any[] = []
      const countText = this.countMode ? `SELECT count(*)::int AS count FROM ${table}${this._where(countParams)}` : null
      return { text, params, countText, countParams }
    }

    if (this.op === 'insert' || this.op === 'upsert') {
      const rows = this._rows()
      if (!rows.length) throw new Error('No rows to insert')
      const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
      cols.forEach(ident)
      const tuples = rows.map(
        (r) =>
          '(' +
          cols
            .map((c) => {
              if (!(c in r) || r[c] === undefined) return 'DEFAULT'
              params.push(columnParam(r[c], this.colTypes[c]))
              return `$${params.length}`
            })
            .join(', ') +
          ')'
      )
      let text = `INSERT INTO ${table} (${cols.map(ident).join(', ')}) VALUES ${tuples.join(', ')}`
      if (this.op === 'upsert') {
        const conflict = (this.onConflict || 'id').split(',').map((c) => c.trim())
        const target = conflict.map(ident).join(', ')
        const updates = cols.filter((c) => !conflict.includes(c))
        text +=
          this.ignoreDuplicates || !updates.length
            ? ` ON CONFLICT (${target}) DO NOTHING`
            : ` ON CONFLICT (${target}) DO UPDATE SET ${updates.map((c) => `${ident(c)} = EXCLUDED.${ident(c)}`).join(', ')}`
      }
      return { text: text + returning, params, countText: null, countParams: [] }
    }

    if (this.op === 'update') {
      const entries = Object.entries(this.values || {}).filter(([, v]) => v !== undefined)
      if (!entries.length) throw new Error('No columns to update')
      const set = entries
        .map(([c, v]) => {
          params.push(columnParam(v, this.colTypes[c]))
          return `${ident(c)} = $${params.length}`
        })
        .join(', ')
      if (!this.filters.length) throw new Error('Refusing to update without a filter')
      return { text: `UPDATE ${table} SET ${set}${this._where(params)}${returning}`, params, countText: null, countParams: [] }
    }

    if (this.op === 'delete') {
      if (!this.filters.length) throw new Error('Refusing to delete without a filter')
      return { text: `DELETE FROM ${table}${this._where(params)}${returning}`, params, countText: null, countParams: [] }
    }

    throw new Error(`Unknown operation ${this.op}`)
  }

  private async _execute(): Promise<DbResult<any>> {
    if (!this.pool) {
      return { data: null, error: { message: 'Database is not configured', code: 'NO_DATABASE' }, count: null, status: 503 }
    }
    try {
      if (this.op !== 'select' && this.op !== 'delete') this.colTypes = await columnTypes(this.pool, this.table)
      const { text, params, countText, countParams } = this._build()
      let count: number | null = null

      if (this.op === 'select' && this.head) {
        const r = await this.rows(countText || `SELECT count(*)::int AS count FROM (${text}) t`, countText ? countParams : params)
        return { data: null, error: null, count: r[0]?.count ?? 0, status: 200 }
      }

      const [rows, countRows] = await Promise.all([
        this.rows(text, params),
        countText ? this.rows(countText, countParams) : null,
      ])
      if (countRows) count = countRows[0]?.count ?? 0

      const returnsRows = this.op === 'select' || !!this.returning
      if (!returnsRows) return { data: null, error: null, count, status: this.op === 'insert' ? 201 : 204 }

      if (this.resultMode === 'single') {
        if (rows.length !== 1) {
          return {
            data: null,
            error: { message: `JSON object requested, multiple (or no) rows returned (${rows.length})`, code: 'PGRST116' },
            count,
            status: 406,
          }
        }
        return { data: rows[0], error: null, count, status: 200 }
      }
      if (this.resultMode === 'maybe') {
        if (rows.length > 1) {
          return { data: null, error: { message: 'Multiple rows returned', code: 'PGRST116' }, count, status: 406 }
        }
        return { data: rows[0] ?? null, error: null, count, status: 200 }
      }
      return { data: rows, error: null, count, status: 200 }
    } catch (err) {
      return { data: null, error: dbError(err), count: null, status: 500 }
    }
  }

  then<R1 = DbResult<T>, R2 = never>(
    resolve?: ((value: DbResult<T>) => R1 | PromiseLike<R1>) | null,
    reject?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    if (!this._promise) this._promise = this._execute()
    return this._promise.then(resolve, reject)
  }
}

export function createQueryClient(pool: Pool | null, storage: any, cacheOpts: CacheOptions | null = null) {
  return {
    from: (table: string): QueryBuilder<any> => {
      ident(table)
      return new QueryBuilder<any>(pool, table, cacheOpts)
    },
    /** Raw SQL for the few places that need it. */
    query: (text: string, params?: any[]) => {
      if (!pool) return Promise.reject(new Error('Database is not configured'))
      return pool.query(text, params)
    },
    storage,
  }
}

// Exported for unit tests.
export const __test = { splitTopLevel, parseCondition, columnList }
