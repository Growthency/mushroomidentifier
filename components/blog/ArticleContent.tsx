'use client'
import TableOfContents from '@/components/blog/TableOfContents'
import IdentifyBanner from '@/components/blog/IdentifyBanner'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Writerfy emits ALL three comparison-table badges with the same class
 * `writerfy-table-badge`, only differing in their text content
 * ("EDITOR'S CHOICE", "TOP PICK", "BEST BUDGET"). CSS can't reliably
 * match elements based on text, so we inject a modifier class here so
 * globals.css can color each variant differently — matching the colors
 * already used by the corresponding award badges in the product blocks
 * below the table (teal / red / blue).
 */
function classifyTableBadges(html: string): string {
  return html.replace(
    /<span\s+class="writerfy-table-badge"\s*>([^<]+)<\/span>/gi,
    (_, text: string) => {
      const upper = text.trim().toUpperCase()
      let modifier = ''
      if (upper.includes('EDITOR'))      modifier = ' wf-tb-editors'
      else if (upper.includes('TOP'))    modifier = ' wf-tb-top'
      else if (upper.includes('BUDGET')) modifier = ' wf-tb-budget'
      else if (upper.includes('BEST'))   modifier = ' wf-tb-budget'
      return `<span class="writerfy-table-badge${modifier}">${text}</span>`
    }
  )
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
  // ── Step 0: Pre-process — classify Writerfy comparison-table badges so
  //           CSS can color each variant (Editor's Choice / Top Pick /
  //           Best Budget) distinctly. Cheap regex pass over the HTML.
  const processedHtml = classifyTableBadges(html)

  // ── Step 1: Find TOC insertion point ──
  // Always split at the first <h2>. If there is no h2, there's nothing to
  // make a TOC of, so we don't insert one at all.
  let beforeToc = ''
  let afterToc = processedHtml

  const firstH2 = processedHtml.search(/<h2[\s>]/i)
  if (firstH2 !== -1) {
    beforeToc = processedHtml.slice(0, firstH2)
    afterToc = processedHtml.slice(firstH2)
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
