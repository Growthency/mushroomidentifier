import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Delete Your Account & Data | Mushroom Identifier',
  description: 'How to delete your Mushroom Identifier account and personal data. Request deletion of your account, scan history, community posts, and all associated data from our website and app.',
}

const LAST_UPDATED = 'July 30, 2026'
const SUPPORT_EMAIL = 'support@mushroomidentifiers.com'
const DELETE_SUBJECT = 'Delete my account and data'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-playfair text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
    </section>
  )
}

export default function DeleteAccountPage() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(DELETE_SUBJECT)}`

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Delete Account &amp; Data</span>
          </nav>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Delete Your Account &amp; Data
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <strong style={{ color: 'var(--text-primary)' }}>{LAST_UPDATED}</strong>
          </p>
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-primary)' }}>
              This page explains how to permanently delete your <strong>Mushroom Identifier</strong> account and personal data, whether you use our website (MushroomIdentifiers.com) or the Mushroom Identifier mobile app. Both share the same account, so deleting your account removes your data from both.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-10">

          <Section title="Option 1 — Request deletion by email (recommended)">
            <p>
              To delete your account and all associated personal data, send us an email from the email address linked to your account:
            </p>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="mb-1"><strong style={{ color: 'var(--text-primary)' }}>To:</strong> <a href={mailto} className="hover:underline" style={{ color: 'var(--accent)' }}>{SUPPORT_EMAIL}</a></p>
              <p className="mb-1"><strong style={{ color: 'var(--text-primary)' }}>Subject:</strong> {DELETE_SUBJECT}</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Message:</strong> Please delete my Mushroom Identifier account and all associated data.</p>
            </div>
            <div className="pt-2">
              <a
                href={mailto}
                className="inline-block px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--btn-primary, var(--accent))', color: '#ffffff' }}
              >
                Email us to delete my account
              </a>
            </div>
            <p>
              We verify the request comes from the account owner, then permanently delete your account. You&apos;ll receive a confirmation once it&apos;s done.
            </p>
          </Section>

          <Section title="Option 2 — Delete from the app">
            <p>
              You can also start account deletion inside the mobile app:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open the <strong style={{ color: 'var(--text-primary)' }}>Mushroom Identifier</strong> app and sign in.</li>
              <li>Go to the <strong style={{ color: 'var(--text-primary)' }}>Profile</strong> tab, then <strong style={{ color: 'var(--text-primary)' }}>Settings</strong>.</li>
              <li>Choose <strong style={{ color: 'var(--text-primary)' }}>Delete account</strong> (or "Support") and confirm.</li>
            </ol>
            <p>
              If you can&apos;t find the option in your app version, please use Option 1 above — it has exactly the same effect.
            </p>
          </Section>

          <Section title="What gets deleted">
            <p>When your account is deleted, we permanently remove:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your account, email, password, and profile (name and avatar)</li>
              <li>Your scan / identification history and saved species</li>
              <li>Your field journal entries</li>
              <li>Your community posts, photos, comments, likes, and follows</li>
              <li>Your credits balance and referral data</li>
            </ul>
          </Section>

          <Section title="What may be retained (and why)">
            <p>
              For legal and accounting reasons, we may retain a limited set of records after deletion:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Transaction / purchase records</strong> — kept for tax and financial compliance, typically up to 7 years. Managed and stored by Google Play / our payment partners, not linked to your deleted profile.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Anonymous, non-identifiable usage data</strong> — cannot be traced back to you and may be kept for analytics.</li>
            </ul>
            <p>
              Everything else that identifies you is deleted from our active systems within <strong style={{ color: 'var(--text-primary)' }}>30 days</strong>. Backups are purged on our normal rotation cycle shortly after.
            </p>
          </Section>

          <Section title="Note about in-app purchases">
            <p>
              Deleting your account does not automatically cancel a subscription bought through Google Play. To cancel an active subscription, open the Google Play Store → Menu → Subscriptions → Mushroom Identifier → Cancel. Deleting your account is permanent and cannot be undone.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about deleting your data? Reach us any time:
            </p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Mushroom Identifier</strong></p>
              <p>Email: <a href={mailto} className="hover:underline" style={{ color: 'var(--accent)' }}>{SUPPORT_EMAIL}</a></p>
              <p>Website: <Link href="/contact" className="hover:underline" style={{ color: 'var(--accent)' }}>Contact Form</Link></p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            → Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            → Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}
