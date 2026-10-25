import sitemap from '@/lib/sitemap-entries'

export const dynamic = 'force-dynamic'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/** /sitemap.xml — same output format as Next's sitemap.ts, built per request. */
export async function GET() {
  const entries = await sitemap()
  const urls = entries.map((e) => {
    let x = `<url>\n<loc>${esc(e.url)}</loc>\n`
    if (e.lastModified) x += `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>\n`
    if (e.changeFrequency) x += `<changefreq>${e.changeFrequency}</changefreq>\n`
    if (e.priority !== undefined) x += `<priority>${e.priority}</priority>\n`
    return x + '</url>\n'
  })
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('') +
    '</urlset>\n'
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=0, must-revalidate' },
  })
}
