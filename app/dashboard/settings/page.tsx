'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  User, Mail, Lock, Save, Check, Camera,
  Crown, Zap, Star, AlertCircle, Loader2, Eye, EyeOff, KeyRound
} from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser]           = useState<any>(null)
  const [profile, setProfile]     = useState<any>(null)
  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Change password state
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [confirmPw, setConfirmPw]   = useState('')
  const [pwSaving, setPwSaving]     = useState(false)
  const [pwSaved, setPwSaved]       = useState(false)
  const [pwError, setPwError]       = useState('')
  const [showCurr, setShowCurr]     = useState(false)
  const [showNew, setShowNew]       = useState(false)
  const [showConf, setShowConf]     = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      setEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setAvatarUrl(data.avatar_url || '')
      }
    }
    load()
  }, [supabase])

  /* ── Avatar upload (via server-side API to bypass bucket RLS) ── */
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      const res = await fetch('/api/upload-avatar', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setAvatarUrl(json.url)
      setProfile((p: any) => ({ ...p, avatar_url: json.url }))
      // Notify DashboardShell to refresh avatar immediately (no page reload needed)
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: { avatar_url: json.url } }))
    } catch (err: any) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setAvatarUploading(false)
    }
  }

  /* ── Profile save — goes through server route, never client-side ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      // Update name via server-side route (plan/credits/etc. cannot be changed this way)
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')

      // Email change still goes through Supabase Auth (not profiles table)
      if (email !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email })
        if (emailErr) throw emailErr
      }

      setProfile((p: any) => ({ ...p, full_name: fullName }))
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: { full_name: fullName } }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  /* ── Password change ── */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (!currentPw) { setPwError('Enter your current password'); return }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setPwError('New passwords do not match'); return }
    setPwSaving(true)
    try {
      // Re-authenticate with current password first
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPw,
      })
      if (signInErr) throw new Error('Current password is incorrect')
      // Now update to new password
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPw })
      if (updateErr) throw updateErr
      setPwSaved(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err: any) {
      setPwError(err.message || 'Password change failed')
    } finally {
      setPwSaving(false)
    }
  }

  const plan      = profile?.plan ?? 'free'
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'explorer' ? 'Explorer' : plan === 'starter' ? 'Starter' : 'Free'
  const planColor = plan === 'pro' ? '#f59e0b' : plan === 'explorer' ? '#8b5cf6' : plan === 'starter' ? '#3b82f6' : 'var(--accent)'
  const credits   = profile?.credits ?? 0
  const initials  = (profile?.full_name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl text-sm"
          style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* ── Profile Card ── */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>Update your photo, name and email</p>

        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold"
              style={{ background: avatarUrl ? 'transparent' : 'var(--accent)', color: '#fff' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : initials}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              {avatarUploading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Camera className="w-4 h-4" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {avatarUploading ? 'Uploading...' : 'Tap camera to change photo'}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                placeholder="your@email.com"
              />
            </div>
            {email !== user?.email && (
              <p className="text-xs mt-1" style={{ color: '#f59e0b' }}>
                ⚠️ A confirmation email will be sent to verify the change.
              </p>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: saved ? '#22c55e' : 'var(--accent)', color: '#fff' }}>
            {saved
              ? <><Check className="w-4 h-4" /> Saved!</>
              : saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* ── Plan & Credits ── */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: planColor + '20', color: planColor }}>
            {plan === 'pro' ? <Crown className="w-5 h-5" /> : plan === 'explorer' ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Plan & Credits</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your current subscription</p>
          </div>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{planLabel} Plan</p>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: planColor + '20', color: planColor }}>{planLabel}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {credits} credits remaining · each scan costs 10 credits
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-faint)' }}>
            <span>Credits remaining</span>
            <span>{credits}/30</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, (credits / 30) * 100))}%`,
                background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444',
              }} />
          </div>
        </div>

        {plan === 'free' && (
          <Link href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--accent), #15803d)', color: '#fff' }}>
            <Crown className="w-4 h-4" /> Upgrade Plan
          </Link>
        )}
      </div>

      {/* ── Change Password ── */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-bg)' }}>
            <KeyRound className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Update your account password</p>
          </div>
        </div>

        {pwError && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-4"
            style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {pwError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type={showCurr ? 'text' : 'password'}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurr(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                {showCurr ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                placeholder="At least 6 characters"
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                {showNew ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type={showConf ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                placeholder="Repeat new password"
              />
              <button type="button" onClick={() => setShowConf(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                {showConf ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>
            </div>
            {confirmPw && newPw && confirmPw !== newPw && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>Passwords do not match</p>
            )}
          </div>

          <button type="submit" disabled={pwSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: pwSaved ? '#22c55e' : 'var(--accent)', color: '#fff' }}>
            {pwSaved
              ? <><Check className="w-4 h-4" /> Password Updated!</>
              : pwSaving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              : <><KeyRound className="w-4 h-4" /> Update Password</>}
          </button>
        </form>
      </div>

    </div>
  )
}
