'use client'
import TableOfContents from '@/components/blog/TableOfContents'
import IdentifyBanner from '@/components/blog/IdentifyBanner'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Shortcode registry — add new shortcodes here.
 * Each key is the shortcode tag (without brackets).
 * The value is the React component to render.
 *
 * Usage in admin editor:  [identify-banner]
 */
const SHORTCODES: Record<string, () => React.ReactNode> = {
  'identify-banner': () => <IdentifyBanner />,
}

/** Split HTML at shortcode placeholders and interleave React components */
function renderWithShortcodes(html: string) {
  // Build a regex that matches any registered shortcode
  const tags = Object.keys(SHORTCODES).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (tags.length === 0) return <div dangerouslySetInnerHTML={{ __html: html }} />

  const regex = new RegExp(`\\[(${tags.join('|')})\\]`, 'gi')
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(html)) !== null) {
    // HTML before this shortcode
    if (match.index > lastIndex) {
      parts.push(
        <div key={`html-${key}`} dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }} />
      )
    }
    // Render the shortcode component
    const tag = match[1].toLowerCase()
    const renderer = SHORTCODES[tag]
    if (renderer) {
      parts.push(<div key={`sc-${key}`} className="not-prose">{renderer()}</div>)
    }
    lastIndex = match.index + match[0].length
    key++
  }

  // Remaining HTML after last shortcode
  if (lastIndex < html.length) {
    parts.push(
      <div key={`html-${key}`} dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }} />
    )
  }

  return parts.length > 0 ? <>{parts}</> : <div dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Renders rich-editor HTML with:
 * 1. Table of Contents (auto-injected after first paragraph)
 * 2. Shortcode expansion ([identify-banner] etc.)
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  // ── Step 1: Find TOC insertion point ──
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

  // ── Step 2: Render with shortcode expansion ──
  return (
    <div className={className} style={style}>
      {beforeToc && renderWithShortcodes(beforeToc)}
      {hasToc && (
        <div className="not-prose">
          <TableOfContents scope="article" />
        </div>
      )}
      {renderWithShortcodes(afterToc)}
    </div>
  )
}
