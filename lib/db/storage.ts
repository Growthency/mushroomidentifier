import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * File storage on the server's disk, with the calls the code used for
 * Supabase Storage:
 *
 *   await db.storage.from('images').upload('blog/x.webp', bytes, { contentType, upsert })
 *   db.storage.from('images').getPublicUrl('blog/x.webp')
 *     → { data: { publicUrl: 'https://mushroomidentifiers.com/uploads/images/blog/x.webp' } }
 *
 * Files live in UPLOAD_DIR/<bucket>/<path> (a persistent Docker volume in
 * production) and are served by app/uploads/[...path]/route.ts.
 */

export function uploadDir(): string {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'))
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://mushroomidentifiers.com').replace(/\/$/, '')
}

/** Resolve a stored path safely inside UPLOAD_DIR (no "..", no absolute paths). */
export function resolveUploadPath(relPath: string): { full: string; clean: string } | null {
  const clean = String(relPath || '')
    .replace(/\\/g, '/')
    .split('/')
    .filter((p) => p && p !== '.' && p !== '..')
    .join('/')
  if (!clean) return null
  const root = uploadDir()
  const full = path.resolve(root, clean)
  if (full !== root && !full.startsWith(root + path.sep)) return null
  return { full, clean }
}

function bucket(name: string) {
  const join = (p: string) => `${name}/${String(p || '').replace(/^\/+/, '')}`
  return {
    async upload(relPath: string, data: any, opts: { contentType?: string; upsert?: boolean; cacheControl?: string } = {}) {
      try {
        const target = resolveUploadPath(join(relPath))
        if (!target) throw new Error('Invalid file path')
        await fs.mkdir(path.dirname(target.full), { recursive: true })
        let bytes: Uint8Array
        if (data instanceof Uint8Array) bytes = data
        else if (data instanceof ArrayBuffer) bytes = new Uint8Array(data)
        else bytes = new Uint8Array(await new Response(data).arrayBuffer())
        await fs.writeFile(target.full, bytes, { flag: opts.upsert ? 'w' : 'wx' })
        return { data: { path: relPath, fullPath: target.clean }, error: null }
      } catch (err: any) {
        const message = err?.code === 'EEXIST' ? 'The resource already exists' : err?.message || String(err)
        return { data: null, error: { message, statusCode: err?.code === 'EEXIST' ? '409' : '500' } }
      }
    },
    async remove(paths: string[]) {
      const removed: string[] = []
      for (const p of paths || []) {
        const target = resolveUploadPath(join(p))
        if (!target) continue
        try {
          await fs.unlink(target.full)
          removed.push(p)
        } catch {
          /* already gone */
        }
      }
      return { data: removed.map((name) => ({ name })), error: null }
    },
    getPublicUrl(relPath: string) {
      const target = resolveUploadPath(join(relPath))
      const encoded = target ? target.clean.split('/').map(encodeURIComponent).join('/') : ''
      return { data: { publicUrl: target ? `${siteUrl()}/uploads/${encoded}` : '' } }
    },
  }
}

export const storage = {
  from: (name: string) => bucket(name),
  // Buckets are plain folders: they always "exist".
  async listBuckets() {
    return { data: [{ id: 'images', name: 'images' }, { id: 'avatars', name: 'avatars' }, { id: 'community', name: 'community' }], error: null }
  },
  async createBucket(_name: string, _opts?: any) {
    return { data: null, error: null }
  },
}
