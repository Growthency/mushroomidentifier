'use client'

/**
 * AdifyProvider — fetches the enabled ad units once per page load and shares
 * them with every <AdSlot> on the page via context. Also tracks the current
 * page type (home vs article) and the device (mobile vs desktop) so slots can
 * filter without each one re-computing it.
 *
 * Mounted inside LayoutShell, so it only runs on public pages (never in
 * /admin or /dashboard).
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { PublicAdUnit, AdPlacement } from '@/lib/ads'
import { matchesPageType, pageTypeForPath } from '@/lib/ads'

interface AdifyContextValue {
  ready: boolean
  isMobile: boolean
  /** Enabled units for a placement, filtered by the current device + page type. */
  getUnits: (placement: AdPlacement) => PublicAdUnit[]
}

const AdifyContext = createContext<AdifyContextValue>({
  ready: false,
  isMobile: false,
  getUnits: () => [],
})

export function useAdify() {
  return useContext(AdifyContext)
}

export default function AdifyProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [units, setUnits] = useState<PublicAdUnit[]>([])
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch the enabled ad units once on mount.
  useEffect(() => {
    let cancelled = false
    fetch('/api/ads')
      .then((r) => (r.ok ? r.json() : { ads: [] }))
      .then((json) => {
        if (cancelled) return
        setUnits(Array.isArray(json?.ads) ? json.ads : [])
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Track device — matchMedia keeps it correct across rotation / resize.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    // Safari < 14 uses addListener/removeListener.
    if (mq.addEventListener) {
      mq.addEventListener('change', update)
      return () => mq.removeEventListener('change', update)
    } else {
      mq.addListener(update)
      return () => mq.removeListener(update)
    }
  }, [])

  const currentPageType = pageTypeForPath(pathname)

  const value = useMemo<AdifyContextValue>(() => {
    return {
      ready,
      isMobile,
      getUnits: (placement: AdPlacement) =>
        units
          .filter((u) => u.placement === placement)
          .filter((u) => matchesPageType(u.page_types, currentPageType))
          .filter((u) => (isMobile ? u.show_mobile : u.show_desktop))
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    }
  }, [units, ready, isMobile, currentPageType])

  return <AdifyContext.Provider value={value}>{children}</AdifyContext.Provider>
}
