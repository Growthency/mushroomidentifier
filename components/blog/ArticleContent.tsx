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

    // Find the first <p> tag in the rendered content
    const firstP = contentRef.current.querySelector('p')
    if (!firstP) return

    // Create a container for the TOC and insert it after the first paragraph
    const container = document.createElement('div')
    container.className = 'toc-portal not-prose'
    firstP.insertAdjacentElement('afterend', container)
    setTocContainer(container)

    return () => {
      // Cleanup on unmount
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
