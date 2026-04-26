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
 * 1. Table of Contents (auto-injected immediately BEFORE the first <h2>,
 *    so the entire intro — however many paragraphs, lists, or images
 *    it contains — sits above the TOC. The first major section heading
 *    follows the TOC.)
 * 2. Shortcode expansion ([identify-banner] etc.)
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  // ── Step 1: Find TOC insertion point ──
  // Always split at the first <h2>. If there is no h2, there's nothing to
  // make a TOC of, so we don't insert one at all.
  let beforeToc = ''
  let afterToc = html

  const firstH2 = html.search(/<h2[\s>]/i)
  if (firstH2 !== -1) {
    beforeToc = html.slice(0, firstH2)
    afterToc = html.slice(firstH2)
  }

  const hasToc = firstH2 !== -1

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
