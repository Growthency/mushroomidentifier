'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, Trash2, LogIn, Send, User, Pencil, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface BlogCommentsProps {
  slug: string
}

export default function BlogComments({ slug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id ?? null)
      fetchComments()
    }
    init()
  }, [slug])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      setComments(data.comments ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to post comment')
      } else {
        setComments(prev => [...prev, data.comment])
        setContent('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
    setEditError('')
  }

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return
    setSavingEdit(true)
    setEditError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content: editContent }),
      })
      if (res.ok) {
        setComments(prev => prev.map(c => c.id === id ? { ...c, content: editContent.trim() } : c))
        setEditingId(null)
        setEditContent('')
      } else {
        const data = await res.json()
        setEditError(data.error || 'Failed to save. Please try again.')
      }
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <section className="mt-12" id="comments">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <div className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', lineHeight: '1.75rem' }}>
          Comments {comments.length > 0 && <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>({comments.length})</span>}
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.profiles?.avatar_url ? (
                  <img
                    src={comment.profiles.avatar_url}
                    alt={comment.profiles.full_name ?? 'User'}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {comment.profiles?.full_name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(comment.created_at)}</span>
                    {currentUserId === comment.user_id && editingId !== comment.id && (
                      <>
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 rounded hover:opacity-70 transition-opacity"
                          title="Edit comment"
                        >
                          <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="p-1 rounded hover:opacity-70 transition-opacity"
                          title="Delete comment"
                        >
                          {deletingId === comment.id ? (
                            <div className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--accent)',
                        color: 'var(--text-primary)',
                      }}
                      autoFocus
                    />
                    {editError && <p className="text-xs text-red-500">{editError}</p>}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        disabled={savingEdit || !editContent.trim()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-50"
                        style={{ background: 'var(--accent)', color: '#fff' }}
                      >
                        {savingEdit ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />

      {/* Comment form or login prompt */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Leave a comment
          </label>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            placeholder="Share your thoughts or experiences..."
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <LogIn className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Sign in</Link>
            {' '}to leave a comment and join the discussion.
          </p>
        </div>
      )}
    </section>
  )
}
