import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | MushroomIdentifiers.com',
  description: 'Read the MushroomIdentifiers.com Terms of Service. By using our AI mushroom identification service, you agree to these terms covering accounts, credits, payments, and liability.',
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

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Terms of Service</span>
          </nav>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <strong style={{ color: 'var(--text-primary)' }}>{LAST_UPDATED}</strong>
          </p>
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-primary)' }}>
              Please read these Terms of Service carefully before using <strong>MushroomIdentifiers.com</strong>. By accessing or using our service, you agree to be bound by these terms. If you do not agree, please do not use the service.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-10">

          <Section title="1. About the Service">
            <p>
              MushroomIdentifiers.com ("the Service", "we", "us") provides an AI-powered mushroom identification tool. Users can upload photographs of mushrooms and receive an AI-generated analysis covering probable species, toxicity warnings, look-alike species, and safety guidance.
            </p>
            <p>
              The Service is intended for <strong style={{ color: 'var(--text-primary)' }}>educational and informational purposes only</strong>. It is not a substitute for expert mycological identification. Never consume any wild mushroom based solely on AI analysis.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 13 years of age to use this Service. By using the Service, you represent that you meet this requirement. If you are under 18, you confirm you have parental or guardian consent.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              You may use limited features without an account (up to 3 free identifications per day per device). To purchase credit packs and access premium features, you must create an account.
            </p>
            <p>When creating an account, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately if you suspect unauthorised access</li>
              <li>Be responsible for all activity under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or abusive behaviour.
            </p>
          </Section>

          <Section title="4. Credits and Payments">
            <p>
              The Service operates on a credit system. Credits are consumed when you perform mushroom identifications (10 credits per identification). Credits can be purchased in packs:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'var(--text-primary)' }}>Starter Pack</strong> — 120 credits ($4.99)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Explorer Pack</strong> — 550 credits ($9.99)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Pro Pack</strong> — 1200 credits ($19.99)</li>
            </ul>
            <p>
              All prices are listed in USD. Credits are non-transferable and cannot be exchanged for cash. Credits do not expire unless otherwise stated.
            </p>
            <p>
              If the AI fails to produce a result due to a technical error on our side, credits used for that request will be refunded to your account automatically.
            </p>
          </Section>

          <Section title="5. Refund Policy">
            <p>
              We offer a <strong style={{ color: 'var(--text-primary)' }}>7-day refund window</strong> for unused credit packs. To request a refund, contact us at <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a> within 7 days of purchase.
            </p>
            <p>
              Refunds are not available for partially used credit packs or credits that have already been consumed. Refunds are issued to the original payment method and may take 5–10 business days to appear depending on your bank or payment provider.
            </p>
          </Section>

          <Section title="6. Acceptable Use">
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Attempt to reverse-engineer, scrape, or copy the AI identification system</li>
              <li>Circumvent usage limits through automated bots or scripts</li>
              <li>Resell or redistribute AI results as a commercial service without our written permission</li>
              <li>Use the Service to provide foraging or safety advice to others for compensation without proper professional qualifications</li>
              <li>Upload images containing personal data of others without their consent</li>
            </ul>
            <p>
              Violation of these rules may result in immediate account suspension and forfeiture of remaining credits without refund.
            </p>
          </Section>

          <Section title="7. Critical Safety Disclaimer">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.2)' }}>
              <p className="font-semibold mb-2" style={{ color: '#e05555' }}>⚠️ Important Safety Warning</p>
              <p>
                Mushroom identification is a complex scientific discipline. Our AI provides analysis based on photographic data alone, which is inherently limited. Factors such as lighting, image angle, growth stage, regional variation, and species overlap mean that AI results can be incorrect.
              </p>
              <p className="mt-3">
                <strong style={{ color: 'var(--text-primary)' }}>NEVER consume any wild mushroom based solely on AI identification results.</strong> Always cross-reference with multiple expert sources, physical field guides, and where in doubt, consult a qualified mycologist. Fatal mushroom poisoning can occur from species that closely resemble edible varieties.
              </p>
              <p className="mt-3">
                MushroomIdentifiers.com accepts <strong style={{ color: 'var(--text-primary)' }}>no liability</strong> for any harm, illness, or death resulting from consuming mushrooms identified or partially identified using our Service.
              </p>
            </div>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              All content on MushroomIdentifiers.com — including but not limited to the AI model, website design, written content, and branding — is owned by or licensed to MushroomIdentifiers.com and protected by copyright and intellectual property laws.
            </p>
            <p>
              You retain ownership of images you upload. By uploading images, you grant us a limited, non-exclusive licence to process those images for the purpose of providing the identification service.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, MushroomIdentifiers.com and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use or inability to use the Service</li>
              <li>Incorrect or incomplete identification results</li>
              <li>Decisions made based on AI-generated content</li>
              <li>Unauthorised access to your account</li>
              <li>Any errors, interruptions, or loss of data</li>
            </ul>
            <p>
              Our total liability to you for any claim arising from use of the Service shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="10. Service Availability">
            <p>
              We strive to maintain a reliable service but do not guarantee 100% uptime. We may temporarily suspend the Service for maintenance, updates, or circumstances beyond our control. We will attempt to provide advance notice of planned downtime where possible.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these Terms of Service at any time. The updated version will be posted on this page with a revised date. Continued use of the Service after changes constitutes your acceptance of the new terms. For material changes, we will notify registered users by email at least 14 days in advance.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable international law. Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be subject to binding arbitration.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>If you have questions about these Terms, please contact us:</p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>MushroomIdentifiers.com</strong></p>
              <p>Email: <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>support@mushroomidentifiers.com</a></p>
              <p>Website: <Link href="/contact" className="hover:underline" style={{ color: 'var(--accent)' }}>Contact Form</Link></p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            → Privacy Policy
          </Link>
          <Link href="/pricing" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            → View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  )
}
