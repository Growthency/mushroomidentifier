'use client'
import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import TableOfContents from '@/components/blog/TableOfContents'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders rich-editor HTML and auto-injects a Table of Contents
 * after the first paragraph using DOM manipulation (no wrapper divs
 * that could break Tailwind prose styling).
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [tocContainer, setTocContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Find the best insertion point for the TOC:
    // 1. After the first <p> tag (ideal — TOC appears after intro paragraph)
    // 2. Before the first <h2> heading (fallback — if no <p> found, e.g. rich editor uses <div>)
    // 3. At the start of the content (last resort)
    const firstP = contentRef.current.querySelector('p')
    const firstH2 = contentRef.current.querySelector('h2')

    const container = document.createElement('div')
    container.className = 'toc-portal not-prose'

    if (firstP) {
      firstP.insertAdjacentElement('afterend', container)
    } else if (firstH2) {
      firstH2.insertAdjacentElement('beforebegin', container)
    } else {
      return // No paragraphs or headings — skip TOC
    }

    setTocContainer(container)

    return () => {
      container.remove()
      setTocContainer(null)
    }
  }, [html])

  return (
    <>
      <div
        ref={contentRef}
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {/* Portal the TOC into the container injected after first paragraph */}
      {tocContainer && createPortal(
        <TableOfContents scope="article" />,
        tocContainer
      )}
    </>
  )
}
