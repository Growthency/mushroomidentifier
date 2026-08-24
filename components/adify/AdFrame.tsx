'use client'

/**
 * AdFrame — renders ONE ad-network snippet inside an isolated, sandboxed,
 * lazy-loaded <iframe>.
 *
 * Why an iframe (and not just injecting the <script> into the page)?
 *
 *  1. Adsterra "iframe" tags each set a GLOBAL `atOptions` variable that
 *     invoke.js reads on load. Put two of them on the same React page and
 *     the second overwrites the first before invoke.js runs → wrong/blank
 *     ads. A separate iframe gives each ad its own `window`, so any number
 *     of units coexist correctly.
 *  2. It survives client-side navigation — every mount is a fresh document,
 *     so ads re-render on route changes instead of going stale.
 *  3. The sandbox blocks `allow-top-navigation`, so an aggressive ad can't
 *     hijack/redirect the whole site — while `allow-popups` still lets a
 *     genuine click open the advertiser in a new tab (so you still get paid).
 *  4. The reserved width/height box means no layout shift (good CLS).
 *
 * The snippet is written into the iframe VERBATIM — never modified.
 */

import { useEffect, useRef, useState } from 'react'

interface AdFrameProps {
  code: string
  width: number
  height: number
  /** Load only when scrolled near the viewport (default true). */
  lazy?: boolean
  /** Force full-width responsive box (used by mobile anchor / narrow columns). */
  fluid?: boolean
  className?: string
  title?: string
}

function buildSrcDoc(code: string): string {
  // A minimal, transparent document that centers the creative. The ad
  // scripts run during initial parse, so Adsterra's document.write / DOM
  // insertion behaves exactly as it does on a plain HTML page.
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}body{display:flex;align-items:center;justify-content:center;width:100%;height:100%}</style></head><body>${code}</body></html>`
}

export default function AdFrame({
  code,
  width,
  height,
  lazy = true,
  fluid = false,
  className,
  title = 'Advertisement',
}: AdFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // When lazy, wait until the ad is near the viewport before injecting srcdoc.
  const [active, setActive] = useState(!lazy)

  useEffect(() => {
    if (active) return
    const el = containerRef.current
    if (!el) return

    // Fallback: if IntersectionObserver is unavailable, load immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true)
            io.disconnect()
            break
          }
        }
      },
      // Start loading ~600px before the slot scrolls into view.
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active])

  const boxStyle: React.CSSProperties = fluid
    ? { width: '100%', maxWidth: width, height, margin: '0 auto' }
    : { width, height, maxWidth: '100%', margin: '0 auto' }

  return (
    <div
      ref={containerRef}
      className={className}
      style={boxStyle}
      aria-hidden={!active}
    >
      {active && (
        <iframe
          title={title}
          srcDoc={buildSrcDoc(code)}
          width={width}
          height={height}
          scrolling="no"
          loading={lazy ? 'lazy' : 'eager'}
          referrerPolicy="no-referrer-when-downgrade"
          // allow-scripts: ad JS runs.  allow-same-origin: invoke.js works
          // reliably.  allow-popups(+escape): a real click opens the
          // advertiser in a new tab.  NO allow-top-navigation → the ad can
          // never redirect your page out from under the visitor.
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          style={{
            border: 0,
            display: 'block',
            width: fluid ? '100%' : width,
            height,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        />
      )}
    </div>
  )
}
