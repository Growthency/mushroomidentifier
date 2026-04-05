'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Copy, Check, Share2, Gift, Users, Star } from 'lucide-react'

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

export default function ReferralPage() {
  const [user, setUser]             = useState<any>(null)
  const [referralCode, setReferralCode] = useState('')
  const [referralStats, setReferralStats] = useState({ count: 0, credits: 0 })
  const [copied, setCopied]         = useState(false)
  const [loading, setLoading]       = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data } = await supabase.from('profiles').select('referral_code').eq('id', user.id).maybeSingle()
      const code = data?.referral_code || genCode(user.id)
      setReferralCode(code)
      if (!data?.referral_code) {
        await supabase.from('profiles').update({ referral_code: code }).eq('id', user.id)
      }
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', user.id)
      setReferralStats({ count: count || 0, credits: (count || 0) * 20 })
      setLoading(false)
    }
    load()
  }, [supabase])

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${referralCode}` : ''

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join MushroomIdentifiers',
        text: 'Sign up with my referral and get 20 bonus credits to identify mushrooms with AI!',
        url: referralLink,
      })
    } else {
      copyLink()
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Hero card */}
      <div className="relative p-6 rounded-2xl overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none rotate-12">🎁</div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-white mb-2">Referral Program</h2>
          <p className="text-sm text-white/80">
            Share your link — both you and your friend get <strong className="text-white">20 bonus credits</strong> when they sign up!
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold text-sm mb-4 text-center" style={{ color: 'var(--text-muted)' }}>HOW IT WORKS</h3>
        <div className="flex items-start gap-0">
          {[
            { icon: '🔗', step: '1', title: 'Share your link', desc: 'Copy and send your unique referral link to friends' },
            { icon: '👤', step: '2', title: 'Friend signs up',  desc: 'They create a free account using your link' },
            { icon: '💎', step: '3', title: 'Both get 20 credits', desc: 'You and your friend each receive 20 bonus credits' },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative">
              {i < 2 && (
                <div className="absolute top-5 left-[calc(50%+20px)] right-0 h-px"
                  style={{ background: 'var(--border)' }} />
              )}
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 relative z-10"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
                {item.icon}
              </div>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <p className="text-xs leading-tight px-1" style={{ color: 'var(--text-faint)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
            <Users className="w-5 h-5" />
          </div>
          <p className="font-playfair text-3xl font-bold" style={{ color: '#8b5cf6' }}>{referralStats.count}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Friends referred</p>
        </div>
        <div className="p-5 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            <Star className="w-5 h-5" />
          </div>
          <p className="font-playfair text-3xl font-bold" style={{ color: 'var(--accent)' }}>+{referralStats.credits}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Bonus credits earned</p>
        </div>
      </div>

      {/* Your code */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold mb-3 text-center" style={{ color: 'var(--text-muted)' }}>YOUR REFERRAL CODE</p>
        <div className="flex items-center justify-center gap-2 p-4 rounded-2xl mb-5"
          style={{ background: 'var(--bg-secondary)', border: '2px dashed #8b5cf640' }}>
          <span className="font-mono text-2xl font-bold tracking-[0.3em]" style={{ color: '#8b5cf6' }}>
            {referralCode}
          </span>
        </div>

        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>YOUR REFERRAL LINK</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 px-3 py-2 rounded-xl text-xs truncate"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {referralLink}
          </div>
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
            style={{
              background: copied ? '#22c55e20' : '#8b5cf620',
              color:      copied ? '#22c55e'   : '#8b5cf6',
              border:     `1px solid ${copied ? '#22c55e40' : '#8b5cf640'}`,
            }}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <button onClick={shareLink}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' }}>
          <Share2 className="w-4 h-4" /> Share with Friends
        </button>
      </div>

      {/* Note */}
      <p className="text-xs text-center pb-4" style={{ color: 'var(--text-faint)' }}>
        Credits are added instantly when your friend signs up. No limit on referrals — keep sharing! 🍄
      </p>
    </div>
  )
}
