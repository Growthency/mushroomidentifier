'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function genCode(uid: string) {
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

function SignupForm() {
  const [fullName, setFullName]               = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]                 = useState(false)
  const [googleLoading, setGoogleLoading]     = useState(false)
  const [error, setError]                     = useState('')
  const [refCode, setRefCode]                 = useState('')
  const router      = useRouter()
  const params      = useSearchParams()
  const supabase    = createClient()

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  useEffect(() => {
    const ref = params.get('ref')
    if (ref) setRefCode(ref.toUpperCase())
  }, [params])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Profile creation via server route — plan/credits hardcoded server-side
      // Client cannot influence plan or credits values
      await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:       data.user.id,
          email,
          fullName,
          referralCode: refCode || null,   // referral applied server-side too
        }),
      })

      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍄</div>
          <h1 className="font-playfair text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {refCode
              ? <span>You were referred! Sign up to get <strong style={{ color: 'var(--accent)' }}>50 credits</strong> (30 + 20 bonus) 🎉</span>
              : 'Start identifying mushrooms with AI — 30 free credits'}
          </p>
        </div>

        <div className="p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-60 mb-5"
            style={{ background: '#fff', color: '#1f2937', border: '1.5px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            {googleLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {refCode && (
              <div className="p-3 rounded-lg text-sm flex items-center gap-2" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                🎁 Referral code applied: <strong>{refCode}</strong> — you'll get 20 bonus credits!
              </div>
            )}

            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input
                type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
              <input
                type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            {/* Manual referral code entry (if not from URL) */}
            {!params.get('ref') && (
              <div>
                <label className="block mb-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Referral Code <span style={{ color: 'var(--text-faint)' }}>(optional)</span>
                </label>
                <input
                  type="text" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC12345"
                  className="w-full px-4 py-3 rounded-lg text-sm font-mono tracking-wider"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-semibold glow-green hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: 'var(--btn-primary)', color: '#fff' }}>
              {loading ? 'Creating account...' : 'Sign Up Free'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
