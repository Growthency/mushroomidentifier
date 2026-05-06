'use client'
/**
 * Hero CTA — "See How It Works"
 *
 * Why this exists as its own client component:
 *   The home page is a server component, and the static `#how-it-works`
 *   section lives inside the `useCustomBlocks ? <HomepageBlocks /> : ...`
 *   fallback. When the admin publishes any custom homepage block via
 *   /admin/homepage, the fallback (and its anchor target) disappears —
 *   so a plain `<a href="#how-it-works">` would update the URL but
 *   silently scroll nowhere.
 *
 * This button instead:
 *   1. Looks for `#how-it-works` and scrolls to it if present.
 *   2. Falls back to `#identifier` (the upload widget) so the user still
 *      lands on the next meaningful surface.
 *   3. As a final safety net, advances by one viewport.
 */
import { useCallback } from 'react'

export default function SeeHowItWorksButton() {
  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target =
      document.getElementById('how-it-works') ||
      document.getElementById('identifier')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Reflect in URL so back-button + share-link still work, but only
      // when we actually hit the named target.
      if (target.id === 'how-it-works') {
        history.replaceState(null, '', '#how-it-works')
      }
      return
    }
    // No anchor found — advance one viewport so the click does *something*.
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })
  }, [])

  return (
    <a
      href="#how-it-works"
      onClick={onClick}
      className="px-8 py-4 rounded-full text-lg font-semibold transition-all"
      style={{
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      See How It Works
    </a>
  )
}
