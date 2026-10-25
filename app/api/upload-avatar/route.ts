import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

const supabase = createClient()
const AVATAR_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File | null
    const userId   = formData.get('userId') as string | null

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    // Only the signed-in user may change their own avatar.
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!AVATAR_TYPES[file.type]) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, WebP or GIF image.' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large. Maximum 5MB.' }, { status: 400 })
    }

    // Ensure bucket exists (creates if not)
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'avatars')
    if (!bucketExists) {
      await supabase.storage.createBucket('avatars', { public: true })
    }

    const ext      = AVATAR_TYPES[file.type]
    const fileName = `${userId}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      })

    if (upErr) throw upErr

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl + `?t=${Date.now()}`

    // Save to profiles
    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
