import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing & Plans — Mushroom Identifier',
  description: 'Monthly subscription plans from $4.99/month. Fresh credits every month, cancel anytime. Starter, Explorer, or Pro.',
  alternates: { canonical: 'https://mushroomidentifiers.com/pricing' },
  openGraph: {
    type: 'website',
    title: 'Pricing & Plans — Mushroom Identifier',
    description: 'Monthly subscription plans from $4.99/month. Fresh credits every month, cancel anytime. Starter, Explorer, or Pro.',
    url: 'https://mushroomidentifiers.com/pricing',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
}

export default function PricingPage() {
  return <PricingClient />
}
