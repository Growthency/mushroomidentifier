import { affiliateBoxHtml, affiliateKitHtml, affiliatePickHtml, type AffiliateContext } from '@/lib/affiliate'

/**
 * Amazon Associates product box. The markup is shared with the CMS article
 * pipeline (lib/affiliate.ts injects the same HTML string into post bodies),
 * so static pages and CMS pages look identical. Styles live in globals.css
 * under `.mi-aff`.
 */
export default function AffiliateBox({
  context = 'default',
  placement = 'static',
}: {
  context?: AffiliateContext
  placement?: string
}) {
  return <div dangerouslySetInnerHTML={{ __html: affiliateBoxHtml(context, placement) }} />
}

/** Compact "forager's kit" card for the blog sidebar, with the Prime bounty line. */
export function AffiliateKit() {
  return <div dangerouslySetInnerHTML={{ __html: affiliateKitHtml() }} />
}

/** Sticky "Editor's pick" card for the sidebar: one product chosen by page context. */
export function AffiliatePick({ context = 'default' }: { context?: AffiliateContext }) {
  return <div dangerouslySetInnerHTML={{ __html: affiliatePickHtml(context) }} />
}
