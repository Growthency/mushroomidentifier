'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, History, BookOpen, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      setProfile(profileData)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="font-playfair text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Good day, {profile?.full_name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome to your dashboard</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-70 transition-opacity" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Total Identifications</p>
            <p className="font-playfair text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {profile?.total_identifications || 0}
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>Credits Remaining</p>
            <p className="font-playfair text-4xl font-bold" style={{ color: 'var(--accent)' }}>
              💎 {profile?.credits || 0}
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Unique Species</p>
            <p className="font-playfair text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              0
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Safety Alerts</p>
            <p className="font-playfair text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              0
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/#identifier" className="p-8 rounded-xl card-lift card-glow group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Sparkles className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>New Identification</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Identify a mushroom with AI</p>
          </Link>

          <div className="p-8 rounded-xl card-lift card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <History className="w-10 h-10 mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>History</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>View past identifications</p>
          </div>

          <div className="p-8 rounded-xl card-lift card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <BookOpen className="w-10 h-10 mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Field Journal</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your discoveries</p>
          </div>
        </div>

        {profile?.credits < 10 && (
          <div className="p-8 rounded-xl text-center" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
            <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--accent)' }}>Running Low on Credits?</h3>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Purchase more credits to continue identifying mushrooms</p>
            <Link href="/pricing" className="inline-block px-6 py-3 rounded-lg font-semibold glow-green hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
              View Pricing →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
