'use client'
import { useState } from 'react'
import { List, ChevronDown } from 'lucide-react'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

interface Props {
  headings: TocHeading[]
}

export default function TableOfContents({ headings }: Props) {
  const [open, setOpen] = useState(true)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const h2Count = headings.filter(h => h.level === 2).length
  let h2Idx = 0

  return (
    <div
      className="rounded-xl overflow-hidden my-8 not-prose text-sm"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hover)',
      }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        aria-expanded={open}
        style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Contents
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {h2Count}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* ── List ── */}
      {open && (
        <div className="px-4 py-3">
          <ol className="space-y-0">
            {headings.map((h) => {
              if (h.level === 2) h2Idx++
              const num = h2Idx
              const isH2 = h.level === 2

              return (
                <li key={h.id} style={{ paddingLeft: isH2 ? 0 : '1.25rem' }}>
                  <button
                    onClick={() => scrollTo(h.id)}
                    className="flex items-baseline gap-2 w-full text-left py-1 group"
                    style={{ lineHeight: 1.4 }}
                  >
                    {isH2 ? (
                      <span
                        className="flex-shrink-0 text-xs font-bold tabular-nums"
                        style={{ color: 'var(--accent)', minWidth: '1.2rem' }}
                      >
                        {num}.
                      </span>
                    ) : (
                      <span
                        className="flex-shrink-0"
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'var(--text-faint)',
                          marginTop: '6px',
                          flexShrink: 0,
                          display: 'inline-block',
                          minWidth: '4px',
                        }}
                      />
                    )}
                    <span
                      className="group-hover:underline underline-offset-2 decoration-1"
                      style={{
                        color: isH2 ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: isH2 ? 500 : 400,
                        fontSize: isH2 ? '0.8125rem' : '0.75rem',
                      }}
                    >
                      {h.text}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}
