import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing & Credit Packs — Mushroom Identifier',
  description:
    'Buy AI mushroom ID credits from $4.99. Starter, Popular, or Pro packs — credits never expire. 14-day money-back guarantee.',
  alternates: {
    canonical: 'https://mushroomidentifiers.com/pricing',
  },
  openGraph: {
    title: 'Pricing & Credit Packs — Mushroom Identifier',
    description:
      'Buy AI mushroom ID credits from $4.99. Starter, Popular, or Pro packs — credits never expire. 14-day money-back guarantee.',
    url: 'https://mushroomidentifiers.com/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
