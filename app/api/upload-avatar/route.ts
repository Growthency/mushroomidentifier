import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role — can create buckets & bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File | null
    const userId   = formData.get('userId') as string | null

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    // Ensure bucket exists (creates if not)
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'avatars')
    if (!bucketExists) {
      await supabase.storage.createBucket('avatars', { public: true })
    }

    const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
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
