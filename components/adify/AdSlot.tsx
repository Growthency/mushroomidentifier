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

export default function AdSlot({ placement, className, spaced = true }: AdSlotProps) {
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

  const units = getUnits(placement)

  if (placement === 'sticky') {
    return <StickyAdBar />
  }

  if (units.length === 0) return null

  const isHeader = placement === 'header'

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
