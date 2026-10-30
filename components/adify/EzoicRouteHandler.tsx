'use client'

/**
 * Next.js changes pages without a reload, so Ezoic has to be told about each
 * new page: clear the old page's ads, then fill the new page's spots.
 */
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { EZOIC_SLOT_SELECTOR, runEzoic } from '@/lib/ezoic'

export default function EzoicRouteHandler() {
  const pathname = usePathname()
  const firstPage = useRef(true)

  useEffect(() => {
    const isFirstPage = firstPage.current
    firstPage.current = false
    runEzoic(() => {
      if (!isFirstPage) window.ezstandalone?.destroyAll()
      requestAnimationFrame(() => window.ezstandalone?.showAds(EZOIC_SLOT_SELECTOR))
    })
  }, [pathname])

  return null
}
