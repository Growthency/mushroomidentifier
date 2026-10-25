/**
 * Better Auth (email + password) on our own PostgreSQL — replaces Supabase Auth.
 *
 * Password compatibility: accounts moved from Supabase keep their GoTrue
 * bcrypt hash (`$2a$10$…`) in account.password, and new passwords are bcrypt
 * too (cost 10, same as GoTrue), so every existing login keeps working.
 *
 * User ids are UUIDs (the same ids Supabase used), so profiles.id,
 * analyses.user_id, saved_articles.user_id … still point at the right user.
 *
 * Env: DATABASE_URL, BETTER_AUTH_SECRET (≥32 random chars),
 *      NEXT_PUBLIC_SITE_URL (https://mushroomidentifiers.com).
 */
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { betterAuth } from 'better-auth'
import { getPool } from '@/lib/db/pool'

const BCRYPT_COST = 10

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://mushroomidentifiers.com').replace(/\/$/, '')
}

function trustedOrigins(): string[] {
  const base = siteUrl()
  const list = [base, base.replace('://', '://www.'), 'http://localhost:3000']
  for (const extra of (process.env.TRUSTED_ORIGINS || '').split(',')) {
    if (extra.trim()) list.push(extra.trim())
  }
  return Array.from(new Set(list))
}

function createAuth() {
  const pool = getPool()
  if (!pool) throw new Error('Database is not configured')
  return betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || siteUrl(),
    basePath: '/api/auth',
    trustedOrigins: trustedOrigins(),
    emailAndPassword: {
      enabled: true,
      // Supabase's minimum; email confirmation was never delivered (no SMTP),
      // so sign-up signs the user straight in.
      minPasswordLength: 6,
      maxPasswordLength: 72,
      autoSignIn: true,
      requireEmailVerification: false,
      password: {
        hash: (password: string) => bcrypt.hash(password, BCRYPT_COST),
        verify: async ({ hash, password }: { hash: string; password: string }) => {
          if (!hash || !hash.startsWith('$2')) return false
          return bcrypt.compare(password, hash)
        },
      },
    },
    user: {
      changeEmail: { enabled: true, updateEmailWithoutVerification: true },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refresh the expiry once a day
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    rateLimit: {
      enabled: process.env.NODE_ENV === 'production',
      window: 60,
      max: 60,
      customRules: {
        '/sign-in/email': { window: 60, max: 10 },
        '/sign-up/email': { window: 60, max: 5 },
        '/change-password': { window: 60, max: 5 },
      },
    },
    advanced: {
      database: { generateId: () => randomUUID() },
      ipAddress: { ipAddressHeaders: ['x-real-ip', 'x-forwarded-for'] },
      useSecureCookies: siteUrl().startsWith('https://'),
    },
  })
}

type Auth = ReturnType<typeof createAuth>

declare global {
  // eslint-disable-next-line no-var
  var __mushroomAuth: Auth | undefined
}

/** The Better Auth instance (created on first use, never during `next build`). */
export function getAuth(): Auth {
  if (!globalThis.__mushroomAuth) globalThis.__mushroomAuth = createAuth()
  return globalThis.__mushroomAuth
}
