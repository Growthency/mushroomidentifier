'use client'

/**
 * Browser client with the small part of the supabase-js surface the pages
 * use, backed by our own API:
 *   auth.*   → Better Auth endpoints under /api/auth
 *   from()   → /api/data, which only allows the signed-in user's own rows
 *              (the rules that Supabase row-level security used to enforce)
 */

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT'
type Listener = (event: AuthEvent, session: { user: any } | null) => void
const listeners = new Set<Listener>()
function emit(event: AuthEvent, user: any) {
  listeners.forEach((fn) => {
    try {
      fn(event, user ? { user } : null)
    } catch {
      /* listener errors never break auth */
    }
  })
}

function toUser(u: any) {
  if (!u?.id) return null
  return {
    id: String(u.id),
    email: String(u.email || ''),
    user_metadata: { full_name: u.name || '', name: u.name || '' },
    created_at: u.createdAt,
  }
}

const ERROR_TEXT: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Invalid login credentials',
  USER_ALREADY_EXISTS: 'User already registered',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'User already registered',
  PASSWORD_TOO_SHORT: 'Password should be at least 6 characters.',
  PASSWORD_TOO_LONG: 'Password is too long.',
  INVALID_EMAIL: 'Unable to validate email address: invalid format',
  INVALID_PASSWORD: 'Current password is incorrect',
}

async function authCall(path: string, body?: any, method = 'POST') {
  try {
    const res = await fetch(`/api/auth${path}`, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      const message =
        (json?.code && ERROR_TEXT[json.code]) ||
        json?.message ||
        (res.status === 429 ? 'Too many attempts. Please wait a minute and try again.' : 'Request failed')
      return { json: null, error: { message, status: res.status, code: json?.code } }
    }
    return { json, error: null }
  } catch {
    return { json: null, error: { message: 'Network error. Please check your connection and try again.' } }
  }
}

let sessionPromise: Promise<any> | null = null
let sessionAt = 0
async function currentUser() {
  // Several components ask at once on page load — share one request.
  if (!sessionPromise || Date.now() - sessionAt > 2000) {
    sessionAt = Date.now()
    sessionPromise = authCall('/get-session', undefined, 'GET').then(({ json }) => toUser(json?.user))
  }
  return sessionPromise
}
function resetSession() {
  sessionPromise = null
}

/* ── /api/data query builder ─────────────────────────────────────── */

class DataQuery implements PromiseLike<any> {
  private q: any
  private _p: Promise<any> | null = null
  constructor(table: string) {
    this.q = { table, op: 'select', columns: '*', filters: [], order: [], limit: null, mode: 'many' }
  }
  select(columns = '*', opts: { count?: string; head?: boolean } = {}) {
    if (this.q.op === 'select') {
      this.q.columns = columns
      this.q.count = opts.count || null
      this.q.head = !!opts.head
    } else this.q.returning = columns || '*'
    return this
  }
  insert(values: any) { this.q.op = 'insert'; this.q.values = values; return this }
  update(values: any) { this.q.op = 'update'; this.q.values = values; return this }
  delete() { this.q.op = 'delete'; return this }
  eq(col: string, value: any) { this.q.filters.push([col, 'eq', value]); return this }
  neq(col: string, value: any) { this.q.filters.push([col, 'neq', value]); return this }
  order(col: string, opts: { ascending?: boolean } = {}) { this.q.order.push([col, opts.ascending !== false]); return this }
  limit(n: number) { this.q.limit = n; return this }
  range(from: number, to: number) { this.q.offset = from; this.q.limit = to - from + 1; return this }
  single() { this.q.mode = 'single'; return this }
  maybeSingle() { this.q.mode = 'maybe'; return this }
  private async run() {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.q),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) return { data: null, count: null, error: { message: json?.error || 'Request failed' } }
      return { data: json?.data ?? null, count: json?.count ?? null, error: json?.error ?? null }
    } catch {
      return { data: null, count: null, error: { message: 'Network error' } }
    }
  }
  then<R1 = any, R2 = never>(resolve?: ((v: any) => R1 | PromiseLike<R1>) | null, reject?: ((r: any) => R2 | PromiseLike<R2>) | null) {
    if (!this._p) this._p = this.run()
    return this._p.then(resolve, reject)
  }
}

const client = {
  auth: {
    async getUser() {
      const user = await currentUser()
      return { data: { user }, error: null }
    },
    async getSession() {
      const user = await currentUser()
      return { data: { session: user ? { user } : null }, error: null }
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const { json, error } = await authCall('/sign-in/email', { email: String(email || '').trim(), password })
      resetSession()
      if (error) return { data: { user: null, session: null }, error }
      const user = toUser(json?.user)
      emit('SIGNED_IN', user)
      return { data: { user, session: { user } }, error: null }
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: { full_name?: string } } }) {
      const { json, error } = await authCall('/sign-up/email', {
        email: String(email || '').trim(),
        password,
        name: options?.data?.full_name || '',
      })
      resetSession()
      if (error) return { data: { user: null, session: null }, error }
      const user = toUser(json?.user)
      emit('SIGNED_IN', user)
      return { data: { user, session: { user } }, error: null }
    },
    async signOut() {
      await authCall('/sign-out', {})
      resetSession()
      emit('SIGNED_OUT', null)
      return { error: null }
    },
    /** Verify the current password and set a new one (one request). */
    async changePassword(currentPassword: string, newPassword: string) {
      const { error } = await authCall('/change-password', { currentPassword, newPassword, revokeOtherSessions: false })
      return { error }
    },
    async updateUser(attrs: { email?: string; password?: string }) {
      if (attrs?.email) {
        return { data: null, error: { message: 'Changing the login email is not available. Please contact support to change it.' } }
      }
      return { data: null, error: { message: 'Use the password form to change your password.' } }
    },
    async signInWithOAuth(_opts?: any) {
      return { data: null, error: { message: 'Google sign-in is not available. Please use your email and password.' } }
    },
    onAuthStateChange(fn: Listener) {
      listeners.add(fn)
      return { data: { subscription: { unsubscribe: () => listeners.delete(fn) } } }
    },
  },
  from(table: string) {
    return new DataQuery(table)
  },
}

export function createClient() {
  return client
}
