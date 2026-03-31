import { CircleCheck as CheckCircle, Globe, Search, Shield } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Mushroom Identifier',
  description: 'Learn about our AI-powered mushroom identification platform. Built by foragers, for foragers, with safety at its core.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          Built by Foragers, for Foragers
        </h1>
        <p className="text-xl text-center mb-16" style={{ color: 'var(--text-muted)' }}>
          AI-powered mushroom identification with safety at its core
        </p>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            { label: '10K+ Species', icon: Search },
            { label: '95% Accuracy', icon: CheckCircle },
            { label: '50K+ IDs', icon: Globe },
            { label: '120+ Countries', icon: Shield },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8 mb-16">
          <div className="p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
            <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>
              We combine cutting-edge AI technology with mycological expertise to make mushroom identification accessible, accurate, and safe for everyone.
            </p>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              Using Claude AI from Anthropic, we analyze thousands of features to identify species and provide critical safety information in seconds.
            </p>
          </div>

          <div className="p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Safety Commitment</h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              AI is a powerful tool, but it's not infallible. We always recommend consulting a professional mycologist before consuming any wild mushroom. Your safety is our top priority.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/#identifier" className="inline-block px-8 py-4 rounded-full text-lg font-semibold glow-green hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
            Try the Identifier Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
