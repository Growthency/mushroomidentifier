'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          Get in Touch
        </h1>
        <p className="text-xl text-center mb-16" style={{ color: 'var(--text-muted)' }}>
          Have questions? We're here to help.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-semibold text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email</p>
                <p style={{ color: 'var(--text-muted)' }}>support@mushroomidentifiers.com</p>
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Response Time</p>
                <p style={{ color: 'var(--text-muted)' }}>Within 24 hours</p>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="p-8 rounded-xl text-center" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
                <p className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>Message sent successfully!</p>
                <p className="mt-2" style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2 rounded-lg" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option>General</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Safety Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-lg font-semibold glow-green hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--btn-primary)', color: '#fff' }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
