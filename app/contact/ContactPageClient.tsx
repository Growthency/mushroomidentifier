'use client'
import { useState } from 'react'
import { Mail, Clock, AlertTriangle, ChevronDown, CheckCircle2, MessageSquare, Bug, Lightbulb, ShieldAlert, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const SUBJECTS = [
  { value: 'General', label: 'General Question', icon: MessageSquare },
  { value: 'Bug Report', label: 'Bug Report', icon: Bug },
  { value: 'Feature Request', label: 'Feature Request', icon: Lightbulb },
  { value: 'Safety Concern', label: 'Safety Concern', icon: ShieldAlert },
]

const FAQ_ITEMS = [
  {
    q: 'How accurate is the mushroom identifier?',
    a: 'Our AI achieves approximately 95% accuracy across 10,000+ species in controlled tests. Accuracy depends on photo quality and angle coverage — uploading 3–4 clear angles (cap top, gills, stem, base) significantly improves results. Always verify with a professional mycologist before consuming any wild mushroom.',
  },
  {
    q: 'Is the mushroom identifier free to use?',
    a: 'Yes. Every user gets 3 free identification scans per day with no account required. Premium plans offer unlimited daily scans, batch identification, and advanced species detail reports.',
  },
  {
    q: 'Can I use the identifier to decide what to eat?',
    a: 'Our tool is designed as a research and educational aid, not a sole identification authority. Never eat a wild mushroom identified only by AI. Some deadly species closely resemble edible ones. Always consult a qualified local mycologist or mycological society for consumption decisions.',
  },
  {
    q: 'How do I get the best identification results?',
    a: 'Upload 3–4 photos from different angles: the top of the cap, the underside showing gills or pores, the full stem including the base, and the surrounding habitat. Good natural lighting and a clean background dramatically improve accuracy.',
  },
  {
    q: 'Does the identifier work offline or as a mobile app?',
    a: 'The web identifier works on all modern mobile browsers — no app download needed. An internet connection is required to process identification requests. A dedicated mobile app is on our development roadmap.',
  },
  {
    q: 'How long does support take to respond?',
    a: 'We respond to all enquiries within 24 hours on business days (Monday–Friday). Safety concerns and bug reports are prioritised. For technical issues with identification results, including a screenshot helps us resolve it faster.',
  },
]

export default function ContactPageClient() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contact_requests').insert([formData])
    setSubmitted(true)
    setLoading(false)
    setFormData({ name: '', email: '', subject: 'General', message: '' })
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
          <MessageSquare className="w-3.5 h-3.5" />
          Support &amp; Contact
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          How Can We Help You?
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Whether you have a technical question, a bug to report, or just want to say hello — we read every message and reply within 24 hours.
        </p>
      </div>

      {/* ── Contact Info Cards ─────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {[
          {
            icon: Mail,
            title: 'Email Us',
            value: 'support@mushroomidentifiers.com',
            sub: 'We reply to every email',
            color: 'var(--accent)',
            bg: 'var(--accent-bg)',
          },
          {
            icon: Clock,
            title: 'Response Time',
            value: 'Within 24 Hours',
            sub: 'Monday – Friday, business days',
            color: '#3b82f6',
            bg: '#3b82f615',
          },
          {
            icon: CheckCircle2,
            title: 'AI Identifier',
            value: 'Available 24/7',
            sub: 'No downtime for identifications',
            color: '#22c55e',
            bg: '#22c55e15',
          },
        ].map((card) => (
          <div key={card.title} className="p-6 rounded-2xl flex flex-col items-center text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: card.bg }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>{card.title}</p>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Emergency Protocol ────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-2xl mb-14" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#ef444425' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div className="flex-1">
            <h2 className="font-playfair text-xl font-bold mb-1" style={{ color: '#ef4444' }}>
              Suspected Mushroom Poisoning? Do Not Use This Form.
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              This contact form is not monitored for emergencies. If you or someone else may have eaten a toxic mushroom, act immediately:
            </p>

            <ol className="text-sm space-y-2 mb-6" style={{ color: 'var(--text-muted)' }}>
              {[
                'Call emergency services immediately — do not wait for symptoms to appear',
                'Contact your regional Poison Control centre (numbers below)',
                'Preserve a sample of the mushroom, or photograph it clearly',
                'Record the time and approximate amount consumed',
                'Do NOT induce vomiting unless explicitly instructed by medical personnel',
                'Go to the nearest emergency room or hospital without delay',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: '#ef444425', color: '#ef4444' }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { region: 'United States', emergency: '911', poison: '1-800-222-1222' },
                { region: 'United Kingdom', emergency: '999', poison: '0344 892 0111' },
                { region: 'Canada', emergency: '911', poison: '1-844-764-7669' },
                { region: 'Australia', emergency: '000', poison: '13 11 26' },
                { region: 'European Union', emergency: '112', poison: 'Local poison centre' },
                { region: 'International', emergency: 'Local emergency', poison: 'Local poison centre' },
              ].map((c) => (
                <div key={c.region} className="p-3 rounded-xl text-xs" style={{ background: '#ef444410', border: '1px solid #ef444420' }}>
                  <p className="font-bold mb-1" style={{ color: '#ef4444' }}>{c.region}</p>
                  <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Phone className="w-3 h-3" /> Emergency: <strong>{c.emergency}</strong>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    <Phone className="w-3 h-3" /> Poison: <strong>{c.poison}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Form + Side Info ──────────────────────────────── */}
      <div className="grid md:grid-cols-5 gap-10 mb-20">

        {/* Side info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              What Can We Help With?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Use the form to reach us about anything related to the platform. Our team includes mycology experts and AI engineers who can address both scientific and technical questions.
            </p>
          </div>

          <div className="space-y-3">
            {SUBJECTS.map((s) => (
              <div key={s.value} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <s.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Tips for faster help</p>
            <ul className="text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Include a screenshot for technical issues</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Describe the mushroom and location for ID questions</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Mention your browser/device for bug reports</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--btn-primary)' }}>
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Message Received!</h3>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. We'll get back to you within 24 hours on business days.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Fill out the form below and we'll reply within 24 hours.</p>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Your Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Subject</label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  placeholder="Describe your question or issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm glow-green hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="font-playfair text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Quick answers to the questions we hear most often.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{ color: 'var(--accent)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Didn't find your answer?</p>
          <Link
            href="/#identifier"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold glow-green hover:opacity-90 transition-opacity"
            style={{ background: 'var(--btn-primary)', color: '#fff' }}
          >
            Try the Identifier Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
