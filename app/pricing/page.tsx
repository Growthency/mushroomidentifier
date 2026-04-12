import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing & Credit Packs — Mushroom Identifier | From $4.99',
  description: 'Buy AI mushroom identification credit packs starting at $4.99 for 12 scans. Choose from Starter, Popular, or Pro packs. Credits never expire — 14-day money-back guarantee.',
  alternates: { canonical: 'https://mushroomidentifiers.com/pricing' },
  openGraph: {
    type: 'website',
    title: 'Pricing & Credit Packs — Mushroom Identifier | From $4.99',
    description: 'Buy AI mushroom identification credit packs starting at $4.99 for 12 scans. Choose from Starter, Popular, or Pro packs. Credits never expire — 14-day money-back guarantee.',
    url: 'https://mushroomidentifiers.com/pricing',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
}

export default function PricingPage() {
  return <PricingClient />
}
