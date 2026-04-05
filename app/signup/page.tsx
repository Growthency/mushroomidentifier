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
  const [error, setError]                     = useState('')
  const [refCode, setRefCode]                 = useState('')
  const router      = useRouter()
  const params      = useSearchParams()
  const supabase    = createClient()

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
      const myCode = genCode(data.user.id)
      // Insert profile with referral_code
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        credits: 30,
        plan: 'free',
        total_identifications: 0,
        referral_code: myCode,
      })

      // Apply referral bonus if a ref code was provided
      if (refCode) {
        try {
          await fetch('/api/referral/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode: refCode, newUserId: data.user.id }),
          })
        } catch {}
      }

      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
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
