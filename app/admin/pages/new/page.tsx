'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft, Save, Eye, Loader2, Image as ImageIcon,
  Upload, Globe, Lock, Search, AlertCircle, CheckCircle2,
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

function slugify(text: string) {
  return '/' + text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function NewPageEditor() {
  const router = useRouter()
  const featuredFileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const contentRef = useRef('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [category, setCategory] = useState('Species Guide')
  const [riskLevel, setRiskLevel] = useState('General')
  const [region, setRegion] = useState('Worldwide')
  const [isPremium, setIsPremium] = useState(false)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [authorName, setAuthorName] = useState('Paul Stamets')
  const [authorRole, setAuthorRole] = useState('Mycologist · Author · Fungi Expert')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  const [autoSlug, setAutoSlug] = useState(true)

  const handleContentChange = (html: string) => {
    contentRef.current = html
    setContent(html)
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (autoSlug) setSlug(slugify(val))
  }

  const handleSlugChange = (val: string) => {
    setAutoSlug(false)
    setSlug(val)
  }

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

  const handleSave = async (pub: boolean) => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!slug.trim()) { setError('Slug is required'); return }

    setSaving(true)
    setError('')

    const finalStatus = pub ? 'published' : status

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: contentRef.current || content,
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
            <h1 className="text-2xl font-bold text-white">New Page</h1>
            <p className="text-sm text-slate-400 mt-0.5">Create a new article</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publish
          </button>
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
              onChange={e => handleTitleChange(e.target.value)}
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
                onChange={e => handleSlugChange(e.target.value)}
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
            <RichEditor value={content} onChange={handleContentChange} />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
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
                  <CheckCircle2 className="w-3 h-3" /> Good length
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
                  <CheckCircle2 className="w-3 h-3" /> Good length
                </span>
              )}
              {metaDescLen > META_DESC_MAX && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" /> Too long — Google will truncate
                </span>
              )}
            </div>

            {/* Google preview */}
            {(metaTitle || title) && (
              <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-slate-700">
                <p className="text-[10px] text-slate-500 mb-1">Google Preview</p>
                <p className="text-blue-400 text-sm font-medium truncate">
                  {(metaTitle || title).slice(0, 60)}{(metaTitle || title).length > 60 ? '…' : ''}
                </p>
                <p className="text-emerald-500 text-xs truncate">
                  mushroomidentifiers.com{slug}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                  {(metaDescription || excerpt || 'No description set').slice(0, 155)}{(metaDescription || excerpt || '').length > 155 ? '…' : ''}
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

          {/* Type (Free / Premium) */}
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
                <Globe className="w-4 h-4" />
                Free
              </button>
              <button
                onClick={() => setIsPremium(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isPremium
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                Premium
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

          {/* Status info */}
          <div className="rounded-xl border p-4" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <h3 className="text-sm font-semibold text-white mb-2">Status</h3>
            <p className="text-xs text-slate-400">
              Use <strong className="text-slate-300">Save Draft</strong> to save without publishing, or{' '}
              <strong className="text-emerald-400">Publish</strong> to make it live immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
