'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft, Save, Eye, Loader2, Image as ImageIcon,
  Upload, Globe, Lock, Trash2, Search, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { useModal } from '@/components/admin/AdminModal'
import { useTheme } from '@/components/providers/ThemeProvider'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), { ssr: false })
const InterlinkChecker = dynamic(() => import('@/components/admin/InterlinkChecker'), { ssr: false })

const CATEGORIES = [
  'Species Guide', 'Safety', 'Edibility Guide', 'Guide',
  'Yard Guide', 'Lawn Guide', 'Cooking', 'Foraging',
]
const RISK_LEVELS = ['General', 'Low Risk', 'High Risk', 'Toxic']
const REGIONS = ['Worldwide', 'US North America', 'EU Europe', 'Temperate', 'Others']

const META_TITLE_MAX = 60
const META_DESC_MAX = 155

export default function EditPageEditor() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { showConfirm, showAlert } = useModal()
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
  const contentRef = useRef('')
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

  const handleContentChange = (html: string) => {
    contentRef.current = html
    setContent(html)
  }

  useEffect(() => {
    if (!postId) { router.push('/admin/pages'); return }

    fetch(`/api/admin/posts?id=${postId}`)
      .then(r => r.json())
      .then((found) => {
        if (found.error) { setError('Post not found'); setLoading(false); return }

        setTitle(found.title || '')
        setSlug(found.slug || '')
        setExcerpt(found.excerpt || '')
        const loadedContent = found.content || ''
        setContent(loadedContent)
        contentRef.current = loadedContent
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
      showAlert('Upload Failed', err.message, 'warning')
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

  const handleDelete = async () => {
    const ok = await showConfirm('Delete Post', 'Are you sure you want to delete this post? This action cannot be undone.', 'danger')
    if (!ok) return
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

  // Theme styles
  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const inputBg = dark ? '#0f172a' : '#f1f5f9'
  const inputBorder = dark ? '#1e293b' : '#d1d5db'
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textLabel = dark ? '#94a3b8' : '#64748b'
  const textMuted = dark ? '#64748b' : '#94a3b8'
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors`
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-lg transition-colors"
            style={{ color: textLabel }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Edit Page</h1>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>ID: {postId}</p>
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ border: `1px solid ${cardBorder}`, color: dark ? '#cbd5e1' : '#475569' }}
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
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <label className="block text-xs font-medium mb-2" style={{ color: textLabel }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter article title…"
              className="w-full px-4 py-3 rounded-lg outline-none text-lg font-semibold"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
            />
          </div>

          {/* Slug / Permalink */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <label className="block text-xs font-medium mb-2" style={{ color: textLabel }}>Permalink</label>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: textMuted }}>mushroomidentifiers.com</span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className={inputCls + ' flex-1'}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <label className="block text-xs font-medium mb-2" style={{ color: textLabel }}>Featured Image</label>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 shrink-0" style={{ color: textMuted }} />
              <input
                type="text"
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                placeholder="/image-filename.webp or https://..."
                className={inputCls + ' flex-1'}
                style={inputStyle}
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
              <div className="mt-3 rounded-lg overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
                <img src={featuredImage} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <label className="block text-xs font-medium mb-2" style={{ color: textLabel }}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short description for search results and previews…"
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: textLabel }}>Content</label>
            <RichEditor value={content} onChange={handleContentChange} />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Status</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('draft')}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: status === 'draft' ? (dark ? 'rgba(100,116,139,0.15)' : '#f1f5f9') : (dark ? '#0f172a' : '#f8fafc'),
                  color: status === 'draft' ? (dark ? '#cbd5e1' : '#334155') : textMuted,
                  border: `1px solid ${status === 'draft' ? (dark ? 'rgba(100,116,139,0.3)' : '#cbd5e1') : (dark ? '#1e293b' : '#e2e8f0')}`,
                }}
              >
                Draft
              </button>
              <button
                onClick={() => setStatus('published')}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: status === 'published' ? 'rgba(16,185,129,0.15)' : (dark ? '#0f172a' : '#f8fafc'),
                  color: status === 'published' ? '#10b981' : textMuted,
                  border: `1px solid ${status === 'published' ? 'rgba(16,185,129,0.3)' : (dark ? '#1e293b' : '#e2e8f0')}`,
                }}
              >
                Published
              </button>
            </div>
          </div>

          {/* Interlink Checker */}
          <InterlinkChecker content={content} />

          {/* SEO / Meta */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>SEO Settings</h3>
            </div>

            <label className="block text-xs mb-1" style={{ color: textLabel }}>Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={title || 'Custom title for search engines…'}
              className={inputCls + ' mb-1'}
              style={inputStyle}
            />
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs ${metaTitleLen > META_TITLE_MAX ? 'text-red-400' : metaTitleLen > 50 ? 'text-amber-400' : ''}`} style={metaTitleLen <= 50 ? { color: textMuted } : undefined}>
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

            <label className="block text-xs mb-1" style={{ color: textLabel }}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder="Brief description for Google search results (max 155 chars)…"
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none mb-1"
              style={inputStyle}
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${metaDescLen > META_DESC_MAX ? 'text-red-400' : metaDescLen > 140 ? 'text-amber-400' : ''}`} style={metaDescLen <= 140 ? { color: textMuted } : undefined}>
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
              <div className="mt-4 p-3 rounded-lg" style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                <p className="text-[10px] mb-1" style={{ color: textMuted }}>Google Preview</p>
                <p className="text-blue-500 text-sm font-medium truncate">
                  {(metaTitle || title).slice(0, 60)}{(metaTitle || title).length > 60 ? '…' : ''}
                </p>
                <p className="text-emerald-600 text-xs truncate">mushroomidentifiers.com{slug}</p>
                <p className="text-xs line-clamp-2 mt-0.5" style={{ color: textLabel }}>
                  {(metaDescription || excerpt || 'No description set').slice(0, 155)}
                </p>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Author</h3>
            <label className="block text-xs mb-1" style={{ color: textLabel }}>Name</label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className={inputCls + ' mb-3'}
              style={inputStyle}
            />
            <label className="block text-xs mb-1" style={{ color: textLabel }}>Role</label>
            <input
              type="text"
              value={authorRole}
              onChange={e => setAuthorRole(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Category</h3>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputCls}
              style={inputStyle}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Access Type</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPremium(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: !isPremium ? 'rgba(16,185,129,0.15)' : (dark ? '#0f172a' : '#f8fafc'),
                  color: !isPremium ? '#10b981' : textMuted,
                  border: `1px solid ${!isPremium ? 'rgba(16,185,129,0.3)' : (dark ? '#1e293b' : '#e2e8f0')}`,
                }}
              >
                <Globe className="w-4 h-4" /> Free
              </button>
              <button
                onClick={() => setIsPremium(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isPremium ? 'rgba(245,158,11,0.15)' : (dark ? '#0f172a' : '#f8fafc'),
                  color: isPremium ? '#f59e0b' : textMuted,
                  border: `1px solid ${isPremium ? 'rgba(245,158,11,0.3)' : (dark ? '#1e293b' : '#e2e8f0')}`,
                }}
              >
                <Lock className="w-4 h-4" /> Premium
              </button>
            </div>
          </div>

          {/* Risk Level */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Risk Level</h3>
            <select
              value={riskLevel}
              onChange={e => setRiskLevel(e.target.value)}
              className={inputCls}
              style={inputStyle}
            >
              {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Region */}
          <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Region</h3>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className={inputCls}
              style={inputStyle}
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
