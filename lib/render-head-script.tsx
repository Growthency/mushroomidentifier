/**
 * Renders admin-pasted code blocks (from /admin/header-scripts) as proper
 * React elements inside <head>.
 *
 * The OLD approach was:
 *
 *     <span dangerouslySetInnerHTML={{ __html: code }} />
 *
 * That was a critical bug. The HTML5 parser treats <span> as flow content,
 * so the moment a browser sees one inside <head> it auto-closes <head> and
 * starts <body>. Every meta/link/style tag rendered AFTER that span gets
 * dragged into <body>, and verifiers like Bing Webmaster Tools quite
 * correctly report "tag not found before <body>".
 *
 * This module parses each pasted snippet and renders the appropriate React
 * element directly — <meta />, <link />, <script />, or <style /> — so
 * <head> stays valid HTML and admins can paste any standard verification
 * tag, analytics snippet, or pixel without corrupting the document.
 */

import type { ReactElement } from 'react'

/** Parse HTML-style attributes out of an attribute substring. */
function parseAttrs(attrStr: string): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {}
  // Matches: name="value" | name='value' | name=value | name (boolean)
  const regex = /([a-zA-Z_][a-zA-Z0-9_:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(attrStr)) !== null) {
    const key = match[1]
    const value = match[2] ?? match[3] ?? match[4]
    result[key] = value !== undefined ? value : true
  }
  return result
}

/** HTML attribute name → React prop name. Most attrs work as-is; these are
    the camelCase exceptions React requires. */
const ATTR_MAP: Record<string, string> = {
  class:           'className',
  for:             'htmlFor',
  'http-equiv':    'httpEquiv',
  charset:         'charSet',
  crossorigin:     'crossOrigin',
  referrerpolicy:  'referrerPolicy',
  srcdoc:          'srcDoc',
  tabindex:        'tabIndex',
  readonly:        'readOnly',
  maxlength:       'maxLength',
  minlength:       'minLength',
  autocomplete:    'autoComplete',
  autofocus:       'autoFocus',
  autoplay:        'autoPlay',
  contenteditable: 'contentEditable',
  spellcheck:      'spellCheck',
}

function toReactProps(attrs: Record<string, string | boolean>): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(attrs)) {
    props[ATTR_MAP[k.toLowerCase()] ?? k] = v
  }
  return props
}

/**
 * Render one admin-pasted code block as a React element safe to put in
 * <head>. Returns null for content that can't be cleanly represented as a
 * single tag (in which case the caller should fall through and skip it
 * rather than risk wrapping it in a span and breaking the document).
 */
export function renderHeadScript(code: string, key: string): ReactElement | null {
  const trimmed = code.trim()
  if (!trimmed) return null

  // <meta ... /> or <meta ... > (Bing, Google Search Console, Meta Pixel verify, OG, etc.)
  const metaMatch = trimmed.match(/^<meta\b([^>]*?)\s*\/?>$/i)
  if (metaMatch) {
    return <meta key={key} {...toReactProps(parseAttrs(metaMatch[1]))} />
  }

  // <link ... /> or <link ... > (preconnect, dns-prefetch, alternate, etc.)
  const linkMatch = trimmed.match(/^<link\b([^>]*?)\s*\/?>$/i)
  if (linkMatch) {
    return <link key={key} {...toReactProps(parseAttrs(linkMatch[1]))} />
  }

  // <script ...>...</script> — inline OR with src=""
  const scriptMatch = trimmed.match(/^<script\b([^>]*)>([\s\S]*?)<\/script>$/i)
  if (scriptMatch) {
    const attrs = toReactProps(parseAttrs(scriptMatch[1]))
    const inner = scriptMatch[2].trim()
    return inner
      ? <script key={key} {...attrs} dangerouslySetInnerHTML={{ __html: inner }} />
      : <script key={key} {...attrs} />
  }

  // <style ...>...</style>
  const styleMatch = trimmed.match(/^<style\b([^>]*)>([\s\S]*?)<\/style>$/i)
  if (styleMatch) {
    const attrs = toReactProps(parseAttrs(styleMatch[1]))
    return (
      <style key={key} {...attrs} dangerouslySetInnerHTML={{ __html: styleMatch[2] }} />
    )
  }

  // Unrecognized snippet — refuse to render in <head> rather than corrupt
  // it with a wrapper element. Admins can use body_start / body_end
  // positions for arbitrary HTML that doesn't fit one of the above.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `[render-head-script] Skipping unsupported head snippet (only <meta>, <link>, <script>, <style> are allowed in <head>):\n${trimmed.slice(0, 200)}`
    )
  }
  return null
}
