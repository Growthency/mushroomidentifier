'use client'
import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'

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
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const h2Count = headings.filter(h => h.level === 2).length
  let h2Idx = 0

  return (
    <div
      className="rounded-2xl overflow-hidden my-10 not-prose"
      style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-opacity hover:opacity-80"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-playfair text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Table of Contents
          </span>
          <span
            className="hidden sm:inline text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {h2Count} sections
          </span>
        </div>
        {open
          ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        }
      </button>

      {/* List */}
      {open && (
        <div
          className="px-5 pb-5 pt-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <ol className="mt-3 space-y-0.5">
            {headings.map((h) => {
              if (h.level === 2) h2Idx++
              const num = h2Idx

              return (
                <li key={h.id}>
                  <button
                    onClick={() => scrollTo(h.id)}
                    className="flex items-start gap-2.5 text-left w-full group rounded-lg px-2 py-1.5 transition-all"
                    style={{ paddingLeft: h.level === 3 ? '2rem' : '0.5rem' }}
                  >
                    {h.level === 2 ? (
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: 'var(--accent)', color: '#fff', fontSize: '10px' }}
                      >
                        {num}
                      </span>
                    ) : (
                      <span
                        className="flex-shrink-0 mt-2.5 ml-1"
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          opacity: 0.45,
                        }}
                      />
                    )}
                    <span
                      className="text-sm leading-snug group-hover:underline underline-offset-2"
                      style={{
                        color: h.level === 2 ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: h.level === 2 ? 600 : 400,
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
