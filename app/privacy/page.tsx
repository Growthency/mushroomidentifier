import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | MushroomIdentifiers.com',
  description: 'Read the MushroomIdentifiers.com Privacy Policy to understand how we collect, use, and protect your personal data in compliance with GDPR and global privacy laws.',
}

const LAST_UPDATED = 'March 31, 2026'

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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Privacy Policy</span>
          </nav>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <strong style={{ color: 'var(--text-primary)' }}>{LAST_UPDATED}</strong>
          </p>
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-primary)' }}>
              This Privacy Policy explains how <strong>MushroomIdentifiers.com</strong> ("we", "us", or "our") collects, uses, and protects your personal information when you use our website and AI mushroom identification service.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-10">

          <Section title="1. Information We Collect">
            <p>We collect information in the following ways:</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information you provide directly:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address and password when you create an account</li>
              <li>Images you upload for mushroom identification</li>
              <li>Messages you send us via the contact form</li>
              <li>Payment information — processed securely by our payment partners (we do not store card numbers)</li>
            </ul>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information collected automatically:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type, browser type, and operating system</li>
              <li>IP address and approximate geographic location</li>
              <li>Pages visited, time spent on pages, and referring URLs</li>
              <li>Identification history linked to your account</li>
              <li>Credits balance and transaction records</li>
            </ul>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information from third parties:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authentication data if you sign in with Google or another OAuth provider</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and operate the AI mushroom identification service</li>
              <li>To process your identification requests and return results</li>
              <li>To manage your account, credits balance, and purchase history</li>
              <li>To send transactional emails (e.g., purchase confirmation, password reset)</li>
              <li>To improve our AI model accuracy and service quality</li>
              <li>To detect and prevent fraudulent or abusive activity</li>
              <li>To comply with legal obligations</li>
              <li>To respond to your support requests or enquiries</li>
            </ul>
            <p>We do <strong style={{ color: 'var(--text-primary)' }}>not</strong> sell your personal data to third parties. We do not use your data for unsolicited marketing without your explicit consent.</p>
          </Section>

          <Section title="3. Images You Upload">
            <p>
              When you upload an image for mushroom identification, that image is transmitted securely to our AI processing infrastructure (powered by Anthropic Claude). Images are used solely to perform the requested identification and are not stored permanently beyond your session unless you are logged in and have enabled Field Journal saving in your account settings.
            </p>
            <p>
              We strongly advise you not to upload images containing recognisable faces, private property, or any personally identifiable information.
            </p>
          </Section>

          <Section title="4. Cookies and Tracking">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep you signed in to your account (authentication session cookies)</li>
              <li>Remember your theme preference (dark/light mode)</li>
              <li>Track anonymous usage analytics to improve the service (via privacy-respecting analytics tools)</li>
            </ul>
            <p>
              You can disable cookies in your browser settings. Disabling authentication cookies will prevent you from staying logged in. We do not use cross-site tracking cookies or advertising cookies.
            </p>
          </Section>

          <Section title="5. Data Storage and Security">
            <p>
              Your account data and identification history are stored in Supabase, a secure cloud database platform with industry-standard encryption at rest and in transit (TLS 1.2+). Payment processing is handled by our payment partners and we do not store raw payment card data on our servers.
            </p>
            <p>
              We implement access controls, encrypted connections, and regular security reviews. However, no internet service can guarantee absolute security. If you suspect unauthorised access to your account, please contact us immediately at <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a>.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are legally required to retain certain records (e.g., financial transaction records for tax compliance, typically 7 years).
            </p>
            <p>
              Anonymous, non-identifiable usage data may be retained indefinitely for analytical purposes.
            </p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>We use the following third-party services that may process your data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — database, authentication, and storage (supabase.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Anthropic</strong> — AI inference for mushroom identification (anthropic.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Vercel</strong> — website hosting and edge delivery (vercel.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Payment processors</strong> — Visa, Mastercard, bKash, Nagad (for credit pack purchases)</li>
            </ul>
            <p>Each of these services has its own privacy policy. We only share the minimum data necessary for these services to function.</p>
          </Section>

          <Section title="8. Your Rights (GDPR / Global Privacy)">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Right of access</strong> — request a copy of your personal data</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Right to rectification</strong> — request correction of inaccurate data</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Right to erasure</strong> — request deletion of your personal data ("right to be forgotten")</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Right to data portability</strong> — receive your data in a machine-readable format</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Right to restrict processing</strong> — ask us to stop processing your data in certain circumstances</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Right to object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p>
              To exercise any of these rights, email us at <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              MushroomIdentifiers.com is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy. For material changes, we will notify registered users by email.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>MushroomIdentifiers.com</strong></p>
              <p>Email: <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a></p>
              <p>Website: <Link href="/contact" className="hover:underline" style={{ color: 'var(--accent)' }}>Contact Form</Link></p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            → Terms of Service
          </Link>
          <Link href="/contact" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            → Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
