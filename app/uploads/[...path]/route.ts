import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { resolveUploadPath } from '@/lib/db/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Serves stored files (blog images, avatars, identification photos, Writerfy
 * images) from UPLOAD_DIR: /uploads/<bucket>/<path>.
 *
 * Only media types are served inline; anything else is a download, and SVGs
 * get a sandbox CSP — files come from our own domain, so they must never be
 * able to run script here.
 */
const TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  bmp: 'image/bmp',
  mp4: 'video/mp4',
  webm: 'video/webm',
  pdf: 'application/pdf',
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const rel = (params.path || []).map((p) => decodeURIComponent(p)).join('/')
  const target = resolveUploadPath(rel)
  if (!target) return new NextResponse('Not found', { status: 404 })

  let stat
  try {
    stat = await fs.stat(target.full)
    if (!stat.isFile()) throw new Error('not a file')
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`
  const headers: Record<string, string> = {
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString(),
    // A week fresh, a month stale-while-revalidate; avatars that are
    // re-uploaded to the same path carry a ?t= cache-buster.
    'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
    'X-Content-Type-Options': 'nosniff',
  }
  if (req.headers.get('if-none-match') === etag) return new NextResponse(null, { status: 304, headers })

  const ext = path.extname(target.full).slice(1).toLowerCase()
  const type = TYPES[ext]
  if (type) headers['Content-Type'] = type
  else {
    headers['Content-Type'] = 'application/octet-stream'
    headers['Content-Disposition'] = 'attachment'
  }
  if (ext === 'svg') headers['Content-Security-Policy'] = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox"

  const body = await fs.readFile(target.full)
  headers['Content-Length'] = String(body.length)
  return new NextResponse(body, { status: 200, headers })
}
