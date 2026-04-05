'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  User, Mail, Lock, Save, Check, Copy, Share2,
  Crown, Zap, Star, Gift, Users, AlertCircle
} from 'lucide-react'

function genCode(uid: string) {
  // deterministic 8-char alphanum from user id
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = ((hash << 5) - hash) + uid.charCodeAt(i)
    hash |= 0
  }
  let code = ''
  let h = Math.abs(hash)
  for (let i = 0; i < 8; i++) {
    code += chars[h % chars.length]
    h = Math.floor(h / chars.length) || (h * 31 + i)
  }
  return code
}

export default function SettingsPage() {
  const [user, setUser]         = useState<any>(null)
  const [profile, setProfile]   = useState<any>(null)
  const [fullName, setFullName]  = useState('')
  const [email, setEmail]        = useState('')
  const [saving, setSaving]      = useState(false)
  const [saved, setSaved]        = useState(false)
  const [error, setError]        = useState('')
  const [copied, setCopied]      = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralStats, setReferralStats] = useState({ count: 0 })
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
        // Use stored code or generate from user id
        const code = data.referral_code || genCode(user.id)
        setReferralCode(code)
        // If no code stored yet, save it
        if (!data.referral_code) {
          await supabase.from('profiles').update({ referral_code: code }).eq('id', user.id)
        }
        // Count how many users were referred by this user
        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('referred_by', user.id)
        setReferralStats({ count: count || 0 })
      }
    }
    load()
  }, [supabase])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      // Update full_name in profiles
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
      // Update email in auth if changed
      if (email !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email })
        if (emailErr) throw emailErr
      }
      setProfile((p: any) => ({ ...p, full_name: fullName }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const copyReferral = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const shareReferral = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`
    if (navigator.share) {
      navigator.share({
        title: 'Join MushroomIdentifiers',
        text: 'Use my referral link to get 20 bonus credits on MushroomIdentifiers!',
        url: link,
      })
    } else {
      copyReferral()
    }
  }

  const plan      = profile?.plan ?? 'free'
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'explorer' ? 'Explorer' : plan === 'starter' ? 'Starter' : 'Free'
  const planColor = plan === 'pro' ? '#f59e0b' : plan === 'explorer' ? '#8b5cf6' : plan === 'starter' ? '#3b82f6' : 'var(--accent)'
  const credits   = profile?.credits ?? 0

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${referralCode}` : ''

  return (
    <div className="max-w-2xl space-y-6">

      {/* Profile Settings */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Update your name and email</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
            style={{ background: '#ef444418', color: '#ef4444' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Full Name
            </label>
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
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Email Address
            </label>
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
                ⚠️ A verification email will be sent to confirm the change.
              </p>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {saved ? <Check className="w-4 h-4" /> : saving ? null : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Plan & Credits */}
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

        <div className="flex items-center justify-between p-4 rounded-xl mb-4"
          style={{ background: 'var(--bg-secondary)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {planLabel} Plan
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {credits} credits remaining · each scan costs 10 credits
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: planColor + '20', color: planColor }}>
            {planLabel}
          </span>
        </div>

        {/* Credits bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-faint)' }}>
            <span>Credits used</span>
            <span>{Math.max(0, 30 - credits)}/30</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, (credits / 30) * 100))}%`,
                background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444'
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

      {/* Referral System */}
      <div id="referral" className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Referral Program</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Invite friends & earn free credits</p>
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '🔗', title: 'Share Link', desc: 'Send your unique referral link' },
            { icon: '👤', title: 'Friend Signs Up', desc: 'They create a free account' },
            { icon: '💎', title: 'Both Get 20', desc: 'You and your friend each get 20 bonus credits' },
          ].map(item => (
            <div key={item.title} className="p-3 rounded-xl text-center"
              style={{ background: 'var(--bg-secondary)' }}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 p-3 rounded-xl mb-5"
          style={{ background: 'var(--bg-secondary)' }}>
          <Users className="w-5 h-5 flex-shrink-0" style={{ color: '#8b5cf6' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {referralStats.count} friend{referralStats.count !== 1 ? 's' : ''} referred
            </p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              +{referralStats.count * 20} bonus credits earned
            </p>
          </div>
        </div>

        {/* Your code */}
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Your Referral Code</p>
          <div className="flex items-center gap-2 p-3 rounded-xl font-mono text-lg font-bold tracking-widest"
            style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', border: '2px dashed var(--accent)' }}>
            {referralCode}
          </div>
        </div>

        {/* Referral link */}
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Your Referral Link</p>
          <div className="flex items-center gap-2">
            <input

              readOnly
              value={referralLink}
              className="flex-1 px-3 py-2 rounded-xl text-xs truncate"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)', outline: 'none' }}
            />
            <button onClick={copyReferral}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-opacity hover:opacity-80"
              style={{ background: copied ? '#22c55e20' : 'var(--accent-bg)', color: copied ? '#22c55e' : 'var(--accent)' }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button onClick={shareReferral}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#8b5cf620', color: '#8b5cf6', border: '1px solid #8b5cf640' }}>
          <Share2 className="w-4 h-4" /> Share with Friends
        </button>
      </div>

      {/* Danger zone */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Account</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Manage your account settings</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <Lock className="w-4 h-4" /> Change Password
          </Link>
        </div>
      </div>
    </div>
  )
}
