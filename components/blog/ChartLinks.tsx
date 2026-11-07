import { chartLinksHtml, getChartLinks } from '@/lib/chart-links'

/** "More identification charts" box for static article pages; shows only live targets. */
export default async function ChartLinks({ slug }: { slug: string }) {
  const html = chartLinksHtml(await getChartLinks(slug))
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
}
