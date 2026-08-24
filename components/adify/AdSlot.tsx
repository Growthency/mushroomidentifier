'use client'

/**
 * AdSlot — drop-in ad placement. Put `<AdSlot placement="sidebar" />` anywhere
 * inside the public layout and it renders whatever enabled ad units the admin
 * has assigned to that placement (respecting device + page-type targeting).
 *
 * Renders nothing at all when no unit matches — safe to sprinkle everywhere.
 *
 * `placement="sticky"` is special: it paints a dismissible anchor bar fixed to
 * the bottom of the viewport instead of an inline block.
 *
 * Sticky ads (admin-controlled per unit, `unit.sticky`):
 *   - header  — once the strip would scroll out of view it pins below the
 *               fixed navbar as a floating glass card and follows the scroll.
 *   - sidebar — the slot uses position:sticky and rides down the (stretched)
 *               sidebar column as the reader scrolls the article.
 * A slot only honors the unit's sticky flag when the layout passes
 * `allowSticky` — so only the intended positions (header strip, LOWER sidebar
 * slot) ever stick, even though the flag defaults to true in the DB.
 */

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useAdify } from './AdifyProvider'
import AdFrame from './AdFrame'
import type { AdPlacement } from '@/lib/ads'

interface AdSlotProps {
  placement: AdPlacement
  className?: string
  /** Extra horizontal breathing room around inline slots. Default true. */
  spaced?: boolean
  /**
   * When set, render only the Nth enabled unit for this placement (0-based)
   * instead of all of them. Used to place several sidebar ads at different
   * positions, each showing a different unit (sorted by sort_order).
   */
  index?: number
  /**
   * Layout opt-in for sticky behavior. The unit's own `sticky` flag only
   * takes effect when the surrounding layout passes this — prevents two
   * sticky ads in one column colliding.
   */
  allowSticky?: boolean
}

/** Small, unobtrusive "Advertisement" label — good practice & network-friendly. */
function AdLabel() {
  return (
    <div
      style={{
        fontSize: 10,
        lineHeight: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--muted-foreground, #94a3b8)',
        textAlign: 'center',
        marginBottom: 4,
        opacity: 0.7,
      }}
    >
      Advertisement
    </div>
  )
}

export default function AdSlot({ placement, className, spaced = true, index, allowSticky = false }: AdSlotProps) {
  const { getUnits } = useAdify()

  // The site navbar is `position: fixed` and transparent until scrolled, so a
  // header ad placed at the top of the flow would sit UNDER it and hide the
  // menu links. Measure the navbar height at runtime and reserve that much
  // space above the header ad so the menu stays fully visible & clickable.
  // max() means a shorter (scrolled) measurement never lets the ad slide back
  // under the full-height nav; paddingTop (not margin) avoids margin-collapse.
  const [navClear, setNavClear] = useState(0)
  useEffect(() => {
    if (placement !== 'header') return
    const measure = () => {
      const nav = document.querySelector('nav') as HTMLElement | null
      if (nav) setNavClear((prev) => Math.max(prev, nav.offsetHeight + 16))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [placement])

  const allUnits = getUnits(placement)
  const units =
    typeof index === 'number'
      ? (allUnits[index] ? [allUnits[index]] : [])
      : allUnits

  // Sticky is active only when BOTH the layout allows it and the unit's
  // admin-controlled flag is on.
  const stickyActive = allowSticky && !!units[0]?.sticky

  // Track the navbar's CURRENT height (it shrinks when the page scrolls) so
  // pinned ads sit exactly below it. Shared by header-pin and sidebar-sticky.
  const [navNow, setNavNow] = useState(0)
  // Header-only: is the strip currently pinned (following the scroll)?
  const [pinned, setPinned] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  // Reserved height so the page doesn't jump when the header strip detaches
  // to position:fixed.
  const [reservedH, setReservedH] = useState(0)

  useEffect(() => {
    if (!stickyActive) return
    let raf = 0
    const update = () => {
      raf = 0
      const nav = document.querySelector('nav') as HTMLElement | null
      const h = nav ? nav.offsetHeight : 0
      setNavNow((prev) => (Math.abs(prev - h) > 3 ? h : prev))
      if (placement === 'header' && outerRef.current) {
        const top = outerRef.current.getBoundingClientRect().top
        // Pin once the slot's box would slide under the navbar.
        setPinned(top < h - 8)
        if (innerRef.current && innerRef.current.offsetHeight > 0) {
          setReservedH((prev) => Math.max(prev, innerRef.current!.offsetHeight))
        }
      }
    }
    const onScrollResize = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScrollResize, { passive: true })
    window.addEventListener('resize', onScrollResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollResize)
      window.removeEventListener('resize', onScrollResize)
    }
  }, [stickyActive, placement])

  if (placement === 'sticky') {
    return <StickyAdBar />
  }

  if (units.length === 0) return null

  const isHeader = placement === 'header'
  const headerPinned = isHeader && stickyActive && pinned

  // Sidebar sticky: pure CSS — rides down the stretched sidebar column and
  // stops at its end automatically (never overlaps the footer).
  const sidebarSticky = placement === 'sidebar' && stickyActive

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        paddingTop: isHeader ? navClear : 0,
        marginTop: isHeader ? 0 : (spaced ? 24 : 0),
        marginBottom: spaced ? 24 : 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        // Keep the strip's space in the page while its content floats.
        minHeight: headerPinned && reservedH ? reservedH : undefined,
        ...(sidebarSticky
          ? { position: 'sticky' as const, top: (navNow || 72) + 16, zIndex: 10 }
          : null),
      }}
    >
      <div
        ref={innerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: headerPinned ? 'auto' : '100%',
          ...(headerPinned
            ? {
                position: 'fixed' as const,
                top: navNow + 6,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 40, // below the navbar (z-50)
                maxWidth: 'calc(100vw - 16px)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(15,23,42,0.08)',
                borderRadius: 14,
                boxShadow: '0 6px 24px rgba(15,23,42,0.14)',
                padding: '4px 10px 8px',
              }
            : null),
        }}
      >
        {units.map((u) => (
          <div key={u.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AdLabel />
            <AdFrame
              code={u.code}
              width={u.width}
              height={u.height}
              lazy={u.lazy_load}
              title={u.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Sticky bottom anchor. Shows the first matching sticky unit, pinned to the
 * bottom with a dismiss button. Dismissal is remembered for the session so it
 * doesn't nag the visitor on every page.
 */
function StickyAdBar() {
  const { getUnits } = useAdify()
  const units = getUnits('sticky')
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem('adify:sticky:dismissed') === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  if (dismissed || units.length === 0) return null
  const unit = units[0]

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          pointerEvents: 'auto',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderTop: '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 -4px 20px rgba(15,23,42,0.10)',
          padding: '6px 10px',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          maxWidth: '100%',
        }}
      >
        <button
          onClick={() => {
            setDismissed(true)
            try {
              sessionStorage.setItem('adify:sticky:dismissed', '1')
            } catch {}
          }}
          aria-label="Close ad"
          style={{
            position: 'absolute',
            top: -12,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: '9999px',
            border: '1px solid rgba(15,23,42,0.12)',
            background: '#fff',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15,23,42,0.15)',
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
        <AdFrame
          code={unit.code}
          width={unit.width}
          height={unit.height}
          lazy={false}
          title={unit.name}
        />
      </div>
    </div>
  )
}
