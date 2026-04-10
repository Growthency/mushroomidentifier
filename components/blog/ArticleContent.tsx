'use client'
import { useMemo } from 'react'
import TableOfContents from '@/components/blog/TableOfContents'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders rich-editor HTML with an auto-generated Table of Contents
 * injected after the first paragraph.
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  // Split HTML after the first closing </p> tag
  const { firstParagraph, restContent } = useMemo(() => {
    const idx = html.indexOf('</p>')
    if (idx === -1) {
      return { firstParagraph: html, restContent: '' }
    }
    const splitAt = idx + 4 // length of '</p>'
    return {
      firstParagraph: html.slice(0, splitAt),
      restContent: html.slice(splitAt),
    }
  }, [html])

  return (
    <div className={className} style={style}>
      {/* First paragraph */}
      <div dangerouslySetInnerHTML={{ __html: firstParagraph }} />

      {/* Auto Table of Contents — scans parent <article> for h2/h3 */}
      <TableOfContents scope="article" />

      {/* Remaining content */}
      {restContent && (
        <div dangerouslySetInnerHTML={{ __html: restContent }} />
      )}
    </div>
  )
}
