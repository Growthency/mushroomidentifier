import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing – Mushroom Identifier Credit Packs',
  description: 'Buy credit packs for AI mushroom identification. Starting at $4.99 for 12 identifications. Credits never expire. 14-day money-back guarantee.',
  alternates: { canonical: 'https://mushroomidentifiers.com/pricing' },
  openGraph: {
    title: 'Pricing – Mushroom Identifier Credit Packs',
    description: 'Buy credit packs for AI mushroom identification. Starting at $4.99 for 12 identifications. Credits never expire.',
    url: 'https://mushroomidentifiers.com/pricing',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
}

export default function PricingPage() {
  return <PricingClient />
}
