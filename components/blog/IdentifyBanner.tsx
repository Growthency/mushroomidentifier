import Link from 'next/link'
import { Scan, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

/**
 * Attractive inline CTA banner for articles.
 * Shortcode: [identify-banner]
 * Links to homepage scanner section (/#identifier)
 */
export default function IdentifyBanner() {
  return (
    <Link
      href="/#identifier"
      className="identify-banner group block my-6 rounded-2xl overflow-hidden relative"
      style={{
        maxWidth: '420px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textDecoration: 'none',
      }}
    >
      {/* Main card */}
      <div
        className="relative rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center gap-4 transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #065f46 60%, #047857 100%)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #34d399, transparent)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #6ee7b7, transparent)',
            transform: 'translate(-20%, 20%)',
          }}
        />

        {/* Sparkle badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{
            background: 'rgba(52, 211, 153, 0.15)',
            color: '#6ee7b7',
            border: '1px solid rgba(52, 211, 153, 0.25)',
          }}
        >
          <Sparkles className="w-3 h-3" />
          Free AI Identification
        </div>

        {/* Icon */}
        <div
          className="relative flex items-center justify-center w-20 h-20 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.3))',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            boxShadow: '0 0 30px rgba(52, 211, 153, 0.15)',
          }}
        >
          <div className="text-4xl">🍄</div>
          <Scan
            className="absolute -bottom-1 -right-1 w-6 h-6 p-1 rounded-full"
            style={{
              background: '#059669',
              color: '#fff',
              border: '2px solid #022c22',
            }}
          />
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <div
            className="text-lg sm:text-xl font-bold leading-tight"
            style={{ color: '#ffffff', margin: 0, padding: 0 }}
          >
            Found a Mushroom?
            <br />
            <span style={{ color: '#6ee7b7' }}>Identify It Instantly</span>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#a7f3d0', opacity: 0.85, margin: '8px 0 0 0', padding: 0 }}
          >
            Upload a photo and our Advanced AI will identify
            the species, toxicity level, and lookalikes in seconds.
          </p>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(167, 243, 208, 0.7)' }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          Trusted by 50,000+ foragers worldwide
        </div>

        {/* CTA button */}
        <div
          className="relative z-10 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 group-hover:gap-3"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Scan className="w-4 h-4" />
          Identify My Mushroom Now
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
