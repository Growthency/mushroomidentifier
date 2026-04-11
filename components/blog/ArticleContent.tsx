'use client'
import TableOfContents from '@/components/blog/TableOfContents'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders rich-editor HTML and injects a Table of Contents
 * after the first paragraph by splitting the HTML string.
 * This avoids DOM manipulation / portal timing issues.
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  // Find the best insertion point for the TOC:
  // 1. After the first closing </p> tag (ideal — TOC appears after intro paragraph)
  // 2. Before the first <h2 heading (fallback)
  // 3. Before all content (last resort)
  let beforeToc = ''
  let afterToc = html

  const firstPEnd = html.indexOf('</p>')
  if (firstPEnd !== -1) {
    const splitAt = firstPEnd + '</p>'.length
    beforeToc = html.slice(0, splitAt)
    afterToc = html.slice(splitAt)
  } else {
    const firstH2 = html.search(/<h2[\s>]/i)
    if (firstH2 !== -1) {
      beforeToc = html.slice(0, firstH2)
      afterToc = html.slice(firstH2)
    }
  }

  const hasToc = html.search(/<h2[\s>]/i) !== -1

  return (
    <div className={className} style={style}>
      {beforeToc && (
        <div dangerouslySetInnerHTML={{ __html: beforeToc }} />
      )}
      {hasToc && (
        <div className="not-prose">
          <TableOfContents scope="article" />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: afterToc }} />
    </div>
  )
}
