'use client'
/**
 * useAdminData — module-level stale-while-revalidate cache for admin
 * fetches.
 *
 * Why this exists:
 *   The admin pages are pure client components (`'use client'`) that each
 *   own their data fetch in `useEffect`. Without a shared cache, every
 *   sidebar nav click triggers a fresh round trip + a full-screen spinner,
 *   so the admin "feels" sluggish even when the API is fast.
 *
 *   This hook:
 *     • Returns cached data instantly on every visit AFTER the first.
 *     • Refetches in the background and updates the UI when new data
 *       arrives (stale-while-revalidate).
 *     • Cache is keyed by URL and shared across pages, so e.g. switching
 *       between Dashboard tabs that hit the same endpoint is free.
 *     • Cache lives for the page session — full reload clears it, which
 *       is the right semantic for an admin tool (login/refresh = clean).
 *
 * Usage:
 *   const { data, isInitialLoading, isRefreshing, error, refetch } =
 *     useAdminData<Stats>('/api/admin/stats?period=30d')
 *
 *   - `isInitialLoading`  → true ONLY when there is no cached data yet
 *                           (use this to show your skeleton).
 *   - `isRefreshing`      → true while a background refetch is in flight
 *                           (use for a tiny corner spinner if you want).
 *   - `data`              → the most recent successful response, OR
 *                           cached stale data while refreshing.
 */
import { useEffect, useRef, useState, useCallback } from 'react'

interface CacheEntry {
  data: unknown
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()

/**
 * Read a cached entry without subscribing. Useful for prefetch helpers
 * that just want to know "do we have this already?".
 */
export function adminCacheHas(url: string): boolean {
  return cache.has(url)
}

/**
 * Imperatively prefetch a URL and stash the result in cache. Safe to
 * call repeatedly — dedupes in-flight requests by URL.
 */
export function prefetchAdminData(url: string): Promise<unknown> {
  if (cache.has(url)) return Promise.resolve(cache.get(url)!.data)
  if (inflight.has(url)) return inflight.get(url)!
  const p = fetch(url, { credentials: 'include' })
    .then(r => r.json())
    .then(json => {
      cache.set(url, { data: json, timestamp: Date.now() })
      inflight.delete(url)
      return json
    })
    .catch(err => {
      inflight.delete(url)
      throw err
    })
  inflight.set(url, p)
  return p
}

/**
 * Manually update or clear a cache entry — handy after a mutation
 * (e.g. delete a post, then `mutateAdminCache('/api/admin/posts')` so
 * the next visit refetches fresh).
 */
export function mutateAdminCache(url: string, value?: unknown) {
  if (typeof value === 'undefined') {
    cache.delete(url)
  } else {
    cache.set(url, { data: value, timestamp: Date.now() })
  }
}

/**
 * Drop every cache entry whose URL begins with the given prefix. Use
 * after a mutation that affects multiple paginated/filtered views of
 * the same resource — e.g. deleting a post invalidates `/api/admin/posts`
 * regardless of which `?page=` and `?status=` was active.
 */
export function invalidateAdminCacheByPrefix(prefix: string) {
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}

export interface UseAdminDataResult<T> {
  data: T | null
  /** true when there's no cached data yet — show your skeleton. */
  isInitialLoading: boolean
  /** true while a background refetch is in flight. */
  isRefreshing: boolean
  error: Error | null
  refetch: () => Promise<void>
  /** Optimistically replace the cached value (and the returned `data`). */
  setData: (next: T) => void
}

export function useAdminData<T = unknown>(
  url: string | null,
): UseAdminDataResult<T> {
  // Seed state from cache so the first render is the cached value when
  // we have one — that's what makes nav feel instant.
  const initial = url ? (cache.get(url)?.data as T | undefined) ?? null : null
  const [data, setDataState] = useState<T | null>(initial)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Keep a ref to whether the component is still mounted — avoids a
  // setState after unmount when navigation is faster than the fetch.
  const aliveRef = useRef(true)
  useEffect(() => {
    aliveRef.current = true
    return () => { aliveRef.current = false }
  }, [])

  const refetch = useCallback(async () => {
    if (!url) return
    setIsRefreshing(true)
    setError(null)
    try {
      const json = await prefetchAdminData(url)
      if (!aliveRef.current) return
      setDataState(json as T)
    } catch (e: any) {
      if (!aliveRef.current) return
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      if (aliveRef.current) setIsRefreshing(false)
    }
  }, [url])

  // Re-run on URL change. We always background-revalidate, even when
  // cache is fresh — admin data should never be visibly stale.
  useEffect(() => {
    if (!url) return
    // Sync state with cache for the new URL, in case it changed.
    const cached = cache.get(url)
    if (cached) setDataState(cached.data as T)
    else setDataState(null)
    refetch()
  }, [url, refetch])

  const setData = useCallback((next: T) => {
    if (url) cache.set(url, { data: next, timestamp: Date.now() })
    setDataState(next)
  }, [url])

  const isInitialLoading = data === null && isRefreshing && !error

  return {
    data,
    isInitialLoading,
    isRefreshing,
    error,
    refetch,
    setData,
  }
}
