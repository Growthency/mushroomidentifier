import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { checkWriterfyAuth } from '@/lib/writerfy-auth'

/**
 * Writerfy image upload endpoint.
 *
 * Accepts a single WebP file plus attribution metadata (alt, license,
 * creator, sourcePage) as multipart/form-data, stores it on the server's
 * disk (images bucket) under writerfy/YYYY/MM/<filename>, and returns a
 * public URL (https://mushroomidentifiers.com/uploads/images/writerfy/…)
 * Writerfy can inject back into the article's Markdown.
 *
 * Auth: same Bearer token as /api/writerfy/publish.
 *
 * Writerfy already compresses to ~100-300 KB WebP and guarantees only
 * commercial-safe licenses (CC0, Public Domain, CC-BY/CC-BY-SA), so this
 * endpoint does no re-validation — just stores and returns.
 */

export const runtime = 'nodejs'

// Max 15 MB — matches Writerfy's documented ceiling. Rejects absurdly
// large uploads before they fill the disk.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

// Log attribution + upload metadata so we have a paper trail for
// copyright provenance even if the Markdown caption is later edited.
// (Swap console.log for a DB insert later if needed — see
// homepage_blocks / site_settings patterns.)
function logAttribution(meta: {
  pathname: string
  alt: string
  license: string
  creator: string
  sourcePage: string
  url: string
  size: number
}) {
  // eslint-disable-next-line no-console
  console.log('[writerfy] image uploaded', meta)
}

export async function POST(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // ── Parse multipart body ─────────────────────────────────────────
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { error: 'invalid multipart body' },
      { status: 400 },
    )
  }

  const file = form.get('file')
  const alt = String(form.get('alt') ?? '').trim()
  const license = String(form.get('license') ?? '').trim()
  const creator = String(form.get('creator') ?? '').trim()
  const sourcePage = String(form.get('sourcePage') ?? '').trim()

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'file field missing or not a file' },
      { status: 400 },
    )
  }

  if (file.size === 0) {
    return NextResponse.json({ error: 'empty file' }, { status: 400 })
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `file too large (${file.size} bytes, max ${MAX_UPLOAD_BYTES})` },
      { status: 413 },
    )
  }

  // ── Build pathname: writerfy/YYYY/MM/<filename> ─────────────────
  // Writerfy pre-slugifies and guarantees per-article uniqueness, so we
  // don't add a random suffix. If the same filename comes back a second
  // time (retry / regenerate) we let it overwrite.
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')

  // Defensive slug: in case Writerfy ever sends a weird name, strip any
  // path separators or control chars before putting it in the key.
  const safeName = (file.name || 'upload.webp')
    .replace(/[\\/]/g, '-')
    .replace(/[^\w.\-]/g, '-')
    .replace(/-+/g, '-')
    .slice(-120) || 'upload.webp'

  const pathname = `writerfy/${yyyy}/${mm}/${safeName}`

  // Only images — files are served from our own domain.
  const ext = safeName.split('.').pop()?.toLowerCase() || ''
  if (!['webp', 'jpg', 'jpeg', 'png', 'gif', 'avif'].includes(ext)) {
    return NextResponse.json({ error: 'only image files (webp, jpg, png, gif, avif) are accepted' }, { status: 415 })
  }

  // ── Store on disk ────────────────────────────────────────────────
  const storage = getDb().storage.from('images')
  const { error: upErr } = await storage.upload(pathname, new Uint8Array(await file.arrayBuffer()), {
    contentType: file.type || 'image/webp',
    // If a retry re-uploads the same pathname, replace it instead of
    // failing — Writerfy expects the returned URL to work immediately.
    upsert: true,
  })
  if (upErr) {
    return NextResponse.json({ error: 'image upload failed', detail: upErr.message }, { status: 500 })
  }
  const url = storage.getPublicUrl(pathname).data.publicUrl

  logAttribution({
    pathname,
    alt,
    license,
    creator,
    sourcePage,
    url,
    size: file.size,
  })

  return NextResponse.json({
    url,
    path: pathname,
  })
}
/* ── GET — health check (useful for Writerfy's connection test) ──── */
export async function GET(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    ok: true,
    service: 'writerfy-upload-image',
    version: 1,
    blobConfigured: true,
  })
}
