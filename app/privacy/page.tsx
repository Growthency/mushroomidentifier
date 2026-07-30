import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | MushroomIdentifiers.com',
  description: 'Read the Mushroom Identifier Privacy Policy to learn how our website and mobile app collect, use, and protect your personal data in compliance with GDPR, Google Play, and privacy laws.',
}

const LAST_UPDATED = 'July 30, 2026'

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
              This Privacy Policy explains how <strong>Mushroom Identifier</strong> ("we", "us", or "our") collects, uses, and protects your personal information when you use our website at <strong>MushroomIdentifiers.com</strong> and our <strong>Mushroom Identifier</strong> mobile app (together, the "Service"). It applies equally to the website and the app, which share the same accounts and infrastructure.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-10">

          <Section title="1. Information We Collect">
            <p>We collect information in the following ways, across both our website and mobile app:</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information you provide directly:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address and password when you create an account</li>
              <li>Your name or display name and, optionally, a profile photo</li>
              <li>Photos of mushrooms you capture or upload for identification</li>
              <li>Content you post to the in-app community — photos, captions, comments, likes, and follows</li>
              <li>Field journal entries and saved species you choose to store</li>
              <li>Messages you send us via the contact form or support email</li>
              <li>Payment information — processed securely by Google Play Billing and our payment partners (we never see or store your card numbers)</li>
            </ul>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information collected automatically:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type, operating system, app version, and (on the web) browser type</li>
              <li>IP address and approximate geographic location, used partly to rate-limit free scans</li>
              <li>A mobile advertising identifier (Advertising ID), used by our advertising partner to show ads (see Section 6)</li>
              <li>Pages or screens viewed and general usage activity</li>
              <li>Your identification (scan) history, credits balance, and transaction records</li>
            </ul>
            <p><strong style={{ color: 'var(--text-primary)' }}>Optional device permissions (mobile app):</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Camera</strong> — only to photograph a mushroom for identification. Used when you tap "Take a photo".</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Photos / storage</strong> — only to let you pick an existing image from your gallery.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Location</strong> — only if you choose to tag a community post or journal entry with where you found a mushroom. It is optional and never collected in the background.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Notifications</strong> — only if you enable optional reminders.</li>
            </ul>
            <p><strong style={{ color: 'var(--text-primary)' }}>Information from third parties:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authentication data (your email and basic profile) if you sign in with Google or another OAuth provider</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and operate the AI mushroom identification service on the website and app</li>
              <li>To process your identification requests and return results</li>
              <li>To manage your account, credits balance, subscriptions, and purchase history</li>
              <li>To power community features (posts, comments, likes, follows) that you choose to use</li>
              <li>To send transactional emails (e.g., purchase confirmation, password reset)</li>
              <li>To show advertisements in the free version of the app (see Section 6)</li>
              <li>To improve our AI accuracy and overall service quality</li>
              <li>To detect and prevent fraudulent, abusive, or automated activity</li>
              <li>To comply with legal obligations and respond to your support requests</li>
            </ul>
            <p>We do <strong style={{ color: 'var(--text-primary)' }}>not</strong> sell your personal data to third parties, and we do not use your data for unsolicited marketing without your explicit consent.</p>
          </Section>

          <Section title="3. Photos You Capture or Upload">
            <p>
              When you submit a photo for identification, that image is transmitted securely to our AI processing infrastructure (powered by Anthropic Claude) to perform the requested identification. If you are signed in, the result and its photo(s) may be saved to your scan history so you can revisit them; you can delete any scan at any time. Guest (not signed-in) scans are not tied to an account.
            </p>
            <p>
              Photos you post to the community are visible to other users. We strongly advise you not to submit images containing recognisable faces, private property, or any personally identifiable information.
            </p>
          </Section>

          <Section title="4. Cookies and Similar Technologies">
            <p>On the website we use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep you signed in to your account (authentication session cookies)</li>
              <li>Remember your theme preference (dark/light mode)</li>
              <li>Track anonymous usage analytics to improve the service</li>
            </ul>
            <p>
              You can disable cookies in your browser settings, though disabling authentication cookies will prevent you from staying logged in. The mobile app does not use browser cookies; it stores your session and preferences locally on your device.
            </p>
          </Section>

          <Section title="5. Data Storage and Security">
            <p>
              Your account data, scan history, and community content are stored in Supabase, a secure cloud database and storage platform with industry-standard encryption at rest and in transit (TLS 1.2+). In-app purchases and subscriptions are handled by Google Play Billing and RevenueCat; we do not store raw payment card data on our servers.
            </p>
            <p>
              We implement access controls, encrypted connections, and regular security reviews. However, no internet service can guarantee absolute security. If you suspect unauthorised access to your account, please contact us immediately at <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a>.
            </p>
          </Section>

          <Section title="6. Advertising (Mobile App)">
            <p>
              The free version of our mobile app may display advertisements through <strong style={{ color: 'var(--text-primary)' }}>Google AdMob</strong>. To serve and measure ads, AdMob may access your device&apos;s Advertising ID and limited technical information, in accordance with{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--accent)' }}>Google&apos;s Privacy Policy</a>.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You can reset or limit your Advertising ID at any time in your device settings (Settings → Google → Ads).</li>
              <li>Purchasing a subscription or credit pack removes ads and stops ad-related data collection in the app.</li>
              <li>We do not show ads on the website, and we do not use advertising cookies there.</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are legally required to retain certain records (e.g., financial transaction records for tax compliance, typically up to 7 years). See our{' '}
              <Link href="/delete-account" className="hover:underline" style={{ color: 'var(--accent)' }}>Account &amp; Data Deletion</Link> page for how to request deletion.
            </p>
            <p>Anonymous, non-identifiable usage data may be retained indefinitely for analytical purposes.</p>
          </Section>

          <Section title="8. Third-Party Services">
            <p>We use the following third-party services that may process your data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — database, authentication, and storage (supabase.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Anthropic</strong> — AI inference for mushroom identification (anthropic.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google AdMob</strong> — advertising in the free app (admob.google.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google Play Billing &amp; RevenueCat</strong> — in-app purchases and subscriptions (revenuecat.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google Sign-In</strong> — optional authentication (google.com)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Vercel</strong> — website hosting and edge delivery (vercel.com)</li>
            </ul>
            <p>Each of these services has its own privacy policy. We only share the minimum data necessary for these services to function.</p>
          </Section>

          <Section title="9. Your Rights (GDPR / Global Privacy)">
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

          <Section title="10. Children's Privacy">
            <p>
              Mushroom Identifier is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated policy. For material changes, we will notify registered users by email.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Mushroom Identifier</strong></p>
              <p>Email: <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a></p>
              <p>Website: <Link href="/contact" className="hover:underline" style={{ color: 'var(--accent)' }}>Contact Form</Link></p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/delete-account" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            → Delete Your Account &amp; Data
          </Link>
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
