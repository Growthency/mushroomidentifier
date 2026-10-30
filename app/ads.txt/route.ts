// Ezoic's seller list (kept up to date by Ezoic) plus our own AdSense line,
// which Ezoic's file does not carry. Refreshed once a day.
export const dynamic = 'force-dynamic'

const EZOIC_ADS_TXT = 'https://srv.adstxtmanager.com/19390/mushroomidentifiers.com'
const ADSENSE_LINE = 'google.com, pub-9887085756488574, DIRECT, f08c47fec0942fa0'

export async function GET() {
  let ezoic = ''
  try {
    const res = await fetch(EZOIC_ADS_TXT, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) })
    if (res.ok) ezoic = await res.text()
  } catch {
    // Ezoic's server is down: still serve our own line.
  }
  return new Response(`${ezoic.trim()}\n${ADSENSE_LINE}\n`.trimStart(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
