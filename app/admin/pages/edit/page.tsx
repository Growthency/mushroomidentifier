'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft, Save, Eye, Loader2, Image as ImageIcon,
  Upload, Globe, Lock, Trash2, Search, AlertCircle, CheckCircle2,
} from 'lucide-react'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), { ssr: false })

const CATEGORIES = [
  'Species Guide', 'Safety', 'Edibility Guide', 'Guide',
  'Yard Guide', 'Lawn Guide', 'Cooking', 'Foraging',
]
const RISK_LEVELS = ['General', 'Low Risk', 'High Risk', 'Toxic']
const REGIONS = ['Worldwide', 'US North America', 'EU Europe', 'Temperate', 'Others']

const META_TITLE_MAX = 60
const META_DESC_MAX = 155

export default function EditPageEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const featuredFileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [category, setCategory] = useState('Species Guide')
  const [riskLevel, setRiskLevel] = useState('General')
  const [region, setRegion] = useState('Worldwide')
  const [isPremium, setIsPremium] = useState(false)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [authorName, setAuthorName] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  useEffect(() => {
    if (!postId) { router.push('/admin/pages'); return }

    fetch(`/api/admin/posts?id=${postId}`)
      .then(r => r.json())
      .then((found) => {
        if (found.error) { setError('Post not found'); setLoading(false); return }

        setTitle(found.title || '')
        setSlug(found.slug || '')
        setExcerpt(found.excerpt || '')
        setContent(found.content || '')
        setFeaturedImage(found.featured_image || '')
        setCategory(found.category || 'Species Guide')
        setRiskLevel(found.risk_level || 'General')
        setRegion(found.region || 'Worldwide')
        setIsPremium(found.is_premium || false)
        setStatus(found.status || 'draft')
        setAuthorName(found.author_name || '')
        setAuthorRole(found.author_role || '')
        setMetaTitle(found.meta_title || '')
        setMetaDescription(found.meta_description || '')
        setLoading(false)
      })
      .catch(() => { setError('Failed to load post'); setLoading(false) })
  }, [postId])

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFeatured(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFeaturedImage(data.url)
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploadingFeatured(false)
      if (featuredFileRef.current) featuredFileRef.current.value = ''
    }
  }

  const handleSave = async (pub?: boolean) => {
    if (!title.trim()) { setError('Title is required'); return }

    setSaving(true)
    setError('')

    const finalStatus = pub ? 'published' : status

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(postId),
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          featured_image: featuredImage.trim(),
          category,
          risk_level: riskLevel,
          region,
          is_premium: isPremium,
          status: finalStatus,
          author_name: authorName,
          author_role: authorRole,
          meta_title: metaTitle.trim(),
          meta_description: metaDescription.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      router.push('/admin/pages')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    setSaving(true)
    try {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(postId) }),
      })
      router.push('/admin/pages')
    } catch {
      setError('Failed to delete')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  const metaTitleLen = metaTitle.length
  const metaDescLen = metaDescription.length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Page</h1>
            <p className="text-sm text-slate-400 mt-0.5">ID: {postId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
          {status !== 'published' && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              Publish
            </button>
          )}
          {status === 'published' && (
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Update
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <label className="block text-xs font-medium text-slate-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter article title…"
              className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 text-lg font-semibold"
            />
          </div>

          {/* Slug / Permalink */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <label className="block text-xs font-medium text-slate-400 mb-2">Permalink</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">mushroomidentifiers.com</span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <label className="block text-xs font-medium text-slate-400 mb-2">Featured Image</label>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                placeholder="/image-filename.webp or https://..."
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => featuredFileRef.current?.click()}
                disabled={uploadingFeatured}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors shrink-0 disabled:opacity-50"
              >
                {uploadingFeatured
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Upload className="w-3.5 h-3.5" />
                }
                Upload
              </button>
              <input
                ref={featuredFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFeaturedUpload}
                className="hidden"
              />
            </div>
            {featuredImage && (
              <div className="mt-3 rounded-lg overflow-hidden border border-slate-700">
                <img src={featuredImage} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <label className="block text-xs font-medium text-slate-400 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short description for search results and previews…"
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Content</label>
            <RichEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('draft')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === 'draft'
                    ? 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setStatus('published')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* SEO / Meta */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">SEO Settings</h3>
            </div>

            <label className="block text-xs text-slate-400 mb-1">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={title || 'Custom title for search engines…'}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 mb-1"
            />
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs ${metaTitleLen > META_TITLE_MAX ? 'text-red-400' : metaTitleLen > 50 ? 'text-amber-400' : 'text-slate-500'}`}>
                {metaTitleLen}/{META_TITLE_MAX} characters
              </span>
              {metaTitleLen > 0 && metaTitleLen <= META_TITLE_MAX && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Good
                </span>
              )}
              {metaTitleLen > META_TITLE_MAX && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" /> Too long
                </span>
              )}
            </div>

            <label className="block text-xs text-slate-400 mb-1">Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder="Brief description for Google search results (max 155 chars)…"
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 resize-none mb-1"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${metaDescLen > META_DESC_MAX ? 'text-red-400' : metaDescLen > 140 ? 'text-amber-400' : 'text-slate-500'}`}>
                {metaDescLen}/{META_DESC_MAX} characters
              </span>
              {metaDescLen > 0 && metaDescLen <= META_DESC_MAX && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Good
                </span>
              )}
              {metaDescLen > META_DESC_MAX && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" /> Too long
                </span>
              )}
            </div>

            {(metaTitle || title) && (
              <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-slate-700">
                <p className="text-[10px] text-slate-500 mb-1">Google Preview</p>
                <p className="text-blue-400 text-sm font-medium truncate">
                  {(metaTitle || title).slice(0, 60)}{(metaTitle || title).length > 60 ? '…' : ''}
                </p>
                <p className="text-emerald-500 text-xs truncate">mushroomidentifiers.com{slug}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                  {(metaDescription || excerpt || 'No description set').slice(0, 155)}
                </p>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Author</h3>
            <label className="block text-xs text-slate-400 mb-1">Name</label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 mb-3"
            />
            <label className="block text-xs text-slate-400 mb-1">Role</label>
            <input
              type="text"
              value={authorRole}
              onChange={e => setAuthorRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Access Type</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPremium(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  !isPremium
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" /> Free
              </button>
              <button
                onClick={() => setIsPremium(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isPremium
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" /> Premium
              </button>
            </div>
          </div>

          {/* Risk Level */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Risk Level</h3>
            <select
              value={riskLevel}
              onChange={e => setRiskLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
            >
              {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Region */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Region</h3>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
