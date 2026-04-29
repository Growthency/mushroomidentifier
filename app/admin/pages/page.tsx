'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Pencil, Trash2, Eye, Loader2, Link2,
  ChevronLeft, ChevronRight, Search, Globe, Lock, ExternalLink,
} from 'lucide-react'
import { useModal } from '@/components/admin/AdminModal'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAdminData, invalidateAdminCacheByPrefix } from '@/hooks/useAdminData'

interface Post {
  id: number; title: string; slug: string; status: string;
  is_premium: boolean; category: string; risk_level: string;
  region: string; views: number; created_at: string; updated_at: string;
  scheduled_at: string | null; published_at: string | null;
  content: string;
}

type StatusFilter = 'all' | 'published' | 'draft' | 'scheduled'

function countInternalLinks(html: string): number {
  if (!html) return 0
  const matches = html.match(/<a\s[^>]*href=["'](\/[^"']*|https?:\/\/mushroomidentifiers\.com[^"']*)["'][^>]*>/gi)
  return matches?.length || 0
}

interface PostsResponse {
  posts: Post[]
  totalPages: number
  total: number
  publishedCount?: number
  draftCount?: number
  scheduledCount?: number
  page: number
}

function buildPostsUrl(p: number, filter: StatusFilter): string {
  const qs = new URLSearchParams({ page: String(p) })
  if (filter !== 'all') qs.set('status', filter)
  return `/api/admin/posts?${qs.toString()}`
}

export default function AdminPagesPage() {
  const { showConfirm } = useModal()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  // Pull through the shared admin cache. After the first visit, returning
  // to this page (or switching filters/pages back to one we've seen) is
  // instant — cached rows render immediately while a background refetch
  // keeps them fresh.
  const url = buildPostsUrl(page, statusFilter)
  const {
    data: pageData,
    isInitialLoading,
    refetch,
  } = useAdminData<PostsResponse>(url)

  const posts: Post[] = pageData?.posts ?? []
  const totalPages = pageData?.totalPages ?? 1
  const total = pageData?.total ?? 0
  const publishedCount = pageData?.publishedCount ?? 0
  const draftCount = pageData?.draftCount ?? 0
  const scheduledCount = pageData?.scheduledCount ?? 0

  // Switch the dashboard pill filter (all / published / draft / scheduled).
  // Reset to page 1 of the matching subset; the cache hook reacts to the
  // URL change automatically.
  const applyFilter = (filter: StatusFilter) => {
    setStatusFilter(filter)
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    const ok = await showConfirm('Delete Post', 'Are you sure you want to delete this post? This action cannot be undone.', 'danger')
    if (!ok) return
    setDeleting(id)
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    // Invalidate every cached posts URL so counts/pagination stay honest
    // — we don't know which pages the deleted post showed up on.
    invalidateAllPostsCache()
    refetch()
    setDeleting(null)
  }

  const filtered = search.trim()
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Pages</h1>
          {/* Filter pills — click any to narrow the list to that status.
              Each pill stays visually distinct (color = status meaning),
              and the currently-active filter gets a stronger ring + bolder
              background so it's obvious which subset you're viewing. */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* All */}
            <button
              onClick={() => applyFilter('all')}
              className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white ring-2 ring-slate-700 shadow-sm'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
              }`}
              title="Show every article regardless of status"
            >
              All <span className="opacity-70 font-normal">{publishedCount + draftCount + scheduledCount}</span>
            </button>

            {/* Published — green */}
            <button
              onClick={() => applyFilter('published')}
              className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-500 shadow-sm shadow-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
              }`}
              title="Live on the public site"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'published' ? 'bg-white' : 'bg-emerald-500'}`} />
              Published <span className="opacity-90 font-normal">{publishedCount}</span>
            </button>

            {/* Draft — amber */}
            <button
              onClick={() => applyFilter('draft')}
              className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-amber-500 text-white ring-2 ring-amber-500 shadow-sm shadow-amber-500/20'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100'
              }`}
              title="Saved but not yet published"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'draft' ? 'bg-white' : 'bg-amber-500'}`} />
              Draft <span className="opacity-90 font-normal">{draftCount}</span>
            </button>

            {/* Scheduled — blue */}
            <button
              onClick={() => applyFilter('scheduled')}
              className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all ${
                statusFilter === 'scheduled'
                  ? 'bg-blue-500 text-white ring-2 ring-blue-500 shadow-sm shadow-blue-500/20'
                  : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100'
              }`}
              title="Auto-publishes at the scheduled time"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'scheduled' ? 'bg-white' : 'bg-blue-500'}`} />
              Scheduled <span className="opacity-90 font-normal">{scheduledCount}</span>
            </button>
          </div>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] outline-none transition-all"
          style={{
            background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
            color: dark ? '#fff' : '#0f172a',
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, background: dark ? 'rgba(255,255,255,0.02)' : '#fff' }}>
        {isInitialLoading && posts.length === 0 ? (
          <PostsTableSkeleton dark={dark} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[13px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No articles found</p>
            <Link href="/admin/pages/new" className="text-emerald-400 text-[13px] mt-2 inline-block hover:underline">
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Title</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Category</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Date</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Views</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Links</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="transition-colors" style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium truncate max-w-[280px]" style={{ color: dark ? '#fff' : '#0f172a' }}>{post.title}</p>
                    <p className="text-[11px] truncate" style={{ color: dark ? '#334155' : '#94a3b8' }}>{post.slug}</p>
                    {/* Show the scheduled-publish time below the slug for any
                        post that's still queued. Lets authors see at a glance
                        when a draft will go live. */}
                    {post.status === 'scheduled' && post.scheduled_at && (
                      <p className="text-[11px] mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 font-medium">
                        <span>📅</span>
                        <span>
                          Publishes {new Date(post.scheduled_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: 'numeric', minute: '2-digit',
                          })}
                        </span>
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11px]" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{post.category}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    {post.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 font-medium">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 font-medium">
                        <Globe className="w-3 h-3" /> Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                        : dark
                          ? 'bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]'
                          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11px]" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{formatDate(post.created_at)}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[12px] font-medium" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    {(() => {
                      const count = countInternalLinks(post.content)
                      return (
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg font-semibold ${
                          count >= 5
                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                            : count >= 1
                              ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
                              : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                        }`}>
                          <Link2 className="w-3 h-3" />
                          {count}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`https://mushroomidentifiers.com${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="View live page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/pages/edit?id=${post.id}`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="Delete"
                      >
                        {deleting === post.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-[11px] font-medium" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
            Page {page} of {totalPages} ({total} articles)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-[13px] transition-colors disabled:opacity-30"
              style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, color: dark ? '#94a3b8' : '#64748b' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] border transition-colors ${
                    p === page
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : ''
                  }`}
                  style={p !== page ? { borderColor: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: dark ? '#94a3b8' : '#64748b' } : undefined}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-[13px] transition-colors disabled:opacity-30"
              style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, color: dark ? '#94a3b8' : '#64748b' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * After a destructive mutation, every page-of-posts URL we've cached is
 * potentially stale (counts shift, deleted post might have lived on
 * page 4, etc.). Drop them all so the next visit refetches fresh.
 */
function invalidateAllPostsCache() {
  invalidateAdminCacheByPrefix('/api/admin/posts')
}

// ── Posts table skeleton (first visit only) ──
function PostsTableSkeleton({ dark }: { dark: boolean }) {
  const pulse = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  return (
    <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` }}>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3.5 w-2/3 rounded animate-pulse" style={{ background: pulse }} />
            <div className="h-2.5 w-1/3 rounded animate-pulse" style={{ background: pulse }} />
          </div>
          <div className="hidden md:block h-3 w-20 rounded animate-pulse" style={{ background: pulse }} />
          <div className="hidden lg:block h-3 w-16 rounded animate-pulse" style={{ background: pulse }} />
          <div className="hidden md:block h-3 w-20 rounded animate-pulse" style={{ background: pulse }} />
          <div className="h-3 w-12 rounded animate-pulse" style={{ background: pulse }} />
        </div>
      ))}
    </div>
  )
}
