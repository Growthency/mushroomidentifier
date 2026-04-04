'use client'
import { useEffect, useState } from 'react'
import { List, ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

// This component auto-scans the article DOM for h2/h3 tags
// and builds the TOC dynamically — no hardcoded props needed.
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

interface Props {
  // Optional: if passed, used directly. If omitted, auto-detected from DOM.
  headings?: TocHeading[]
  // CSS selector scope — defaults to 'article'
  scope?: string
}

export default function TableOfContents({ headings: propHeadings, scope = 'article' }: Props) {
  const [open, setOpen] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>(propHeadings ?? [])

  useEffect(() => {
    // Auto-detect headings from the DOM
    const container = document.querySelector(scope) ?? document
    const nodes = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[]

    const built: Heading[] = nodes
      .filter(el => el.textContent?.trim())
      .map((el, idx) => {
        // Auto-inject id if missing
        if (!el.id) {
          const generated = el.textContent!
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 60)
          el.id = generated || `heading-${idx}`
        }
        return {
          id: el.id,
          text: el.textContent!.trim(),
          level: (parseInt(el.tagName[1]) as 2 | 3),
        }
      })

    if (built.length > 0) setHeadings(built)
  }, [scope])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const h2s = headings.filter(h => h.level === 2)

  if (headings.length === 0) return null

  // Build numbered counter for H2 only
  let h2Counter = 0

  return (
    <div
      className="rounded-xl overflow-hidden my-8 not-prose"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hover)',
        fontSize: '13px',
      }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5"
        aria-expanded={open}
        style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <List className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Table of Contents
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {h2s.length}
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
        <div className="px-4 pt-2 pb-3">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {headings.map((h) => {
              if (h.level === 2) h2Counter++
              const num = h2Counter
              const isH2 = h.level === 2

              return (
                <li
                  key={h.id}
                  style={{
                    paddingLeft: isH2 ? 0 : '1.1rem',
                    margin: 0,
                  }}
                >
                  <button
                    onClick={() => scrollTo(h.id)}
                    className="flex items-start gap-1.5 w-full text-left group"
                    style={{ padding: '2px 0', lineHeight: 1.45, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {isH2 ? (
                      <span
                        style={{
                          color: 'var(--accent)',
                          fontWeight: 700,
                          flexShrink: 0,
                          minWidth: '1.4rem',
                          fontSize: '13px',
                        }}
                      >
                        {num}.
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'var(--text-faint)',
                          flexShrink: 0,
                          marginTop: '6px',
                        }}
                      />
                    )}
                    <span
                      className="group-hover:underline decoration-1 underline-offset-2"
                      style={{
                        color: isH2 ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: isH2 ? 500 : 400,
                        fontSize: isH2 ? '13px' : '12px',
                      }}
                    >
                      {h.text}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
