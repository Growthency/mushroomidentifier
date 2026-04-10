import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | MushroomIdentifiers.com',
  description: 'MushroomIdentifiers.com refund policy. All purchases are processed by Paddle.com as our authorised reseller and Merchant of Record. 14-day refund window.',
}

const LAST_UPDATED = 'April 10, 2026'

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

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Refund Policy</span>
          </nav>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Refund Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <strong style={{ color: 'var(--text-primary)' }}>{LAST_UPDATED}</strong>
          </p>
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-primary)' }}>
              All purchases made on <strong>MushroomIdentifiers.com</strong> are processed by{' '}
              <strong>Paddle.com</strong> as our authorised reseller and Merchant of Record. Paddle
              is responsible for billing, payment processing, and refunds on our behalf.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-10">

          <Section title="1. Merchant of Record">
            <p>
              MushroomIdentifiers.com is operated by <strong style={{ color: 'var(--text-primary)' }}>Isloo Marketing</strong>.
              All payments are processed by <strong style={{ color: 'var(--text-primary)' }}>Paddle.com</strong> (Paddle.com Market Limited,
              registered in England and Wales, company number 08172165), which acts as our Merchant of Record.
              Paddle handles all billing inquiries, payment processing, and refund requests on behalf of Isloo Marketing
              and MushroomIdentifiers.com.
            </p>
            <p>
              When you purchase a credit pack on MushroomIdentifiers.com, your payment statement will show a charge
              from <strong style={{ color: 'var(--text-primary)' }}>Paddle.com</strong>.
            </p>
          </Section>

          <Section title="2. Our Refund Guarantee">
            <p>
              We offer a <strong style={{ color: 'var(--text-primary)' }}>14-day refund window</strong> on all
              purchases made on MushroomIdentifiers.com. If you are not satisfied with your purchase for any reason,
              you may request a full refund within 14 days of the transaction date.
            </p>
            <p>
              Refunds are processed in accordance with{' '}
              <a
                href="https://www.paddle.com/legal/refund-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Paddle&apos;s Refund Policy
              </a>
              . As our Merchant of Record, Paddle is ultimately responsible for issuing refunds.
            </p>
          </Section>

          <Section title="3. How to Request a Refund">
            <p>You can request a refund through any of the following methods:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Contact Paddle directly</strong> — visit{' '}
                <a
                  href="https://www.paddle.com/legal/buyer-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Paddle&apos;s Buyer Terms
                </a>{' '}
                or reach Paddle support at{' '}
                <a
                  href="https://paddle.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  paddle.net
                </a>
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Contact us directly</strong> — email{' '}
                <a
                  href="mailto:support@mushroomidentifiers.com"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  support@mushroomidentifiers.com
                </a>{' '}
                with your order details and we will coordinate the refund with Paddle on your behalf.
              </li>
            </ul>
            <p>
              Please include your order number or the email address used at checkout when contacting us.
            </p>
          </Section>

          <Section title="4. Refund Processing Time">
            <p>
              Once a refund is approved by Paddle, the refunded amount will be returned to your original
              payment method. Processing times vary depending on your bank or card provider but typically
              take <strong style={{ color: 'var(--text-primary)' }}>5–10 business days</strong> to appear
              on your statement.
            </p>
          </Section>

          <Section title="5. Subscription Cancellations">
            <p>
              If you have a subscription plan, you may cancel at any time from your account dashboard or
              by contacting us. Cancellation stops future billing. For refunds on subscription charges,
              the same 14-day window applies per billing cycle.
            </p>
          </Section>

          <Section title="6. Contact">
            <p>For any questions about this Refund Policy, please contact us:</p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Isloo Marketing</strong></p>
              <p><strong style={{ color: 'var(--text-primary)' }}>MushroomIdentifiers.com</strong></p>
              <p>
                Email:{' '}
                <a href="mailto:support@mushroomidentifiers.com" className="hover:underline" style={{ color: 'var(--accent)' }}>
                  support@mushroomidentifiers.com
                </a>
              </p>
              <p>
                Website:{' '}
                <Link href="/contact" className="hover:underline" style={{ color: 'var(--accent)' }}>
                  Contact Form
                </Link>
              </p>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            → Terms of Service
          </Link>
          <Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            → Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
