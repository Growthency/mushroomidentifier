import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next 13.5 self-hosted ISR bug: when a cached page is (re)generated during a
 * conditional request (If-None-Match / If-Modified-Since — e.g. a browser that
 * still holds an ETag from the old Vercel site), the 304 status is stored with
 * the page and then served to EVERY visitor as an empty 304, which crashes the
 * app ("Application error: a client-side exception has occurred").
 *
 * Dropping the conditional headers before Next renders means it always answers
 * 200 with the full page; pages are still cached by Next's ISR on the server.
 */
export function middleware(req: NextRequest) {
  if (!req.headers.has('if-none-match') && !req.headers.has('if-modified-since')) return NextResponse.next()
  const headers = new Headers(req.headers)
  headers.delete('if-none-match')
  headers.delete('if-modified-since')
  return NextResponse.next({ request: { headers } })
}

export const config = {
  // Pages only — static assets, images, uploads and API routes are untouched.
  matcher: ['/((?!_next/static|_next/image|uploads/|api/|favicon|.*\\.(?:png|jpg|jpeg|webp|avif|gif|svg|ico|txt|xml)$).*)'],
}
