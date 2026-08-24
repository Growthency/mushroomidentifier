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
 *   - header  — the strip is position:sticky: it scrolls with the page until
 *               it reaches the navbar, then pins just below it.
 *   - sidebar — position:sticky inside the (stretched) sidebar column; the ad
 *               rides down the rail as the reader scrolls the article.
 * A slot only honors the unit's sticky flag when the layout passes
 * `allowSticky` — so only the intended positions (header strip, LOWER sidebar
 * slot) ever stick, even though the flag defaults to true in the DB.
 *
 * IMPORTANT implementation note: both sticky modes are PURE CSS
 * (position: sticky). An earlier version pinned the header by swapping the
 * wrapper to position:fixed and mutating min-heights from a scroll handler —
 * that fought Chrome's scroll anchoring and could hard-freeze the renderer on
 * long articles. Never reintroduce scroll-handler layout mutation here;
 * sticky elements are exempt from scroll anchoring by spec, so this version
 * stays smooth. overflow-anchor is disabled on the slots as extra safety.
 */

import { useEffect, useState } from 'react'
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
  // menu links. Measure the navbar's full height once (plus on resize) and
  // reserve that much space above the header ad so the menu stays fully
  // visible & clickable. max() keeps the largest seen value so the shrunken
  // scrolled nav never lets the ad slide back under the full-height nav.
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

  if (placement === 'sticky') {
    return <StickyAdBar />
  }

  if (units.length === 0) return null

  const isHeader = placement === 'header'

  // ── Pure-CSS sticky offsets ──
  // Scrolled nav is shorter than the full one; ~64px covers it comfortably.
  const SCROLLED_NAV = 72
  // Header slot: its box includes navClear of top padding. Sticking the BOX
  // at top:(SCROLLED_NAV - navClear) places the AD (below the padding) just
  // under the scrolled navbar. Negative top is valid for position:sticky.
  const headerSticky = isHeader && stickyActive
  const sidebarSticky = placement === 'sidebar' && stickyActive

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: isHeader ? navClear : 0,
        marginTop: isHeader ? 0 : (spaced ? 24 : 0),
        marginBottom: spaced ? 24 : 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        // Sticky elements are exempt from scroll anchoring, but disable it
        // explicitly so ad-height settling can never tug the scroll position.
        overflowAnchor: 'none',
        ...(headerSticky
          ? { position: 'sticky' as const, top: SCROLLED_NAV - (navClear || 104), zIndex: 40 }
          : null),
        ...(sidebarSticky
          ? { position: 'sticky' as const, top: SCROLLED_NAV + 16, zIndex: 10 }
          : null),
      }}
    >
      {units.map((u) => (
        <div
          key={u.id}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...(headerSticky
              ? {
                  // Soft glass card so the pinned banner stays readable when
                  // it floats over page content while scrolling.
                  width: 'fit-content',
                  maxWidth: '100%',
                  background: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(15,23,42,0.06)',
                  borderRadius: 14,
                  boxShadow: '0 4px 18px rgba(15,23,42,0.08)',
                  padding: '4px 10px 8px',
                }
              : null),
          }}
        >
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
